<template>
  <div class="display">
    <div class="content">
      <h3>{{title}}</h3>
      <div class="top" v-if="description!=''">
        {{description}}
      </div>
      <el-card shadow="hover" class="box-card" v-for="(item,index) in detail">
        <div slot="header" class="clearfix">

          <div class="questionTitle" :id="item._id">
            <!--显示必填标识-->
            <span style="color: #F56C6C;">
              <span v-if="item.must">*</span>
              <span v-else>&nbsp;</span>
            </span>
            {{(index+1)+'.'+item.title}}
          </div>
        </div>

        <!--单选题展示-->
        <div class="text item" v-if="item.type=='radio'" v-for="optionItem in item.options">
          <el-radio v-model="item.answer" :label="optionItem._id" style="margin: 5px;">{{ optionItem.title }}</el-radio>
        </div>

        <!--多选题展示-->
        <el-checkbox-group v-if="item.type=='checkbox'" v-model="item.answer">
          <div class="text item"  v-for="optionItem in item.options">
            <el-checkbox :label="optionItem._id" style="margin: 5px;">{{ optionItem.title }}</el-checkbox>
          </div>
        </el-checkbox-group>

        <!--填空题展示-->
        <el-input v-if="item.type=='text'" type="textarea" :rows="item.row" v-model="item.answer" resize="none"></el-input>

        <div v-if="item.type=='number'">
          <el-input type="number" v-model.number="item.answer" style="width: 20%" resize="none" @input="checkNumber(item)"></el-input>
          <el-alert v-if="validator[item._id].invalid" :title="item.numberType === 'integer' ? '无效整数' : '无效实数'" type="error" :closable="false" style="margin-top: 10px; width: 20%"></el-alert>
        </div>

        <el-rate v-if="item.type=='rate'" :max="item.row" v-model="item.answer"></el-rate>

      </el-card>
       <el-button type="primary" style="margin: 5px;" @click="submit" :loading="submitLoading">{{submitText}}</el-button>

      <div class="bottom">
        <el-link type="info" href="/index">QNMaker&nbsp;提供技术支持</el-link>
      </div>
    </div>
  </div>
</template>
<script>
  import {answerOpera} from './api'
  export default{
    data(){
      return{
        dialogShow:false,
        dialogTitle:'',
        title:'',
        description:'',
        detail:[],
        startTimestamp:0,
        submitLoading:false,
        submitText:'提交',
        validator: {}
      }
    },
    mounted(){
      var questionnaireId=this.$route.params.id;
      //Check permission
      answerOpera({
        opera_type:'checkPermission',
        questionnaireId:questionnaireId,
        username:sessionStorage.getItem('username')
      }).then(data=>{
        console.log(data);
        let message = '';
        switch (data.code) {
          case -10: message = '该问卷不存在'; break;
          case -8: message = '该问卷未发布'; break;
          case -4: message = '提交次数达到上限'; break;
          case 0: console.log('Effective permission'); break;
          default: message = "操作失败"; break;
        }
        if (data.code === -6) {
          this.$message({
            type: 'error',
            message: '该问卷仅限注册用户填写'
          });
          this.$router.push({path:'/login'});
        } else if (data.code === 0) {
          //Effective permission
          answerOpera({
            opera_type:'fetch',
            questionnaireId:questionnaireId,
            username:sessionStorage.getItem('username')//增加登录验证后不需传递（后端从session获取）
          }).then(data=>{
            console.log(data.detail);
            if(data.code === 0){
              this.title=data.title;
              this.description=data.description;
              this.detail=data.detail;
              document.title=data.title;
              for (let item of this.detail) {
                if (item.type === 'number') {
                  this.validator[item._id] = {invalid: false}
                }
              }
            } else{
              this.$message({
                type: 'error',
                message: data.msg
              });
            }
          });
          this.startTimestamp=new Date().getTime();//时间戳 毫秒
        } else {
          this.$router.push({path:`/fail/${message}`});
        }
      });
    },
    methods:{
      checkNumber(item) {
        if (item.numberType === 'integer' && /^-?\d+$/.test(item.answer) === false) {
          this.validator[item._id].invalid = true;
          return true;
        } else if (item.numberType === 'real' && /^-?\d+(\.\d+)?$/.test(item.answer) === false) {
          this.validator[item._id].invalid = true;
          return true;
        }
        this.validator[item._id].invalid = false;
        return false;
      },
      checkAnswer(type, value) {
        if (type === 'checkbox' && value.length <= 0) {
          return true;
        } else {
          return value == null;
        }
      },
      //提交问卷
      submit(){
        this.submitLoading=true;
        this.submitText='提交中';
        for (let item of this.detail) {
          if (item.must === true && this.checkAnswer(item.type, item.answer) === true) {
            window.location.hash = item._id;
            this.submitLoading=false;
            this.submitText='提交';
            this.$notify.error({
              title: '必答题未填写'
            });
            return;
          }
          if (item.type === 'number' && this.checkNumber(item)) {
            window.location.hash = item._id;
            this.submitLoading=false;
            this.submitText='提交';
            return;
          }
        }
        var questionnaireId=this.$route.params.id;
        let useTime=parseInt((new Date().getTime()-this.startTimestamp)/1000);//填写问卷用时 秒
        answerOpera({
          opera_type:'submit',
          questionnaireId:questionnaireId,
          useTime:useTime,
          detail:this.detail
        })
          .then(data=>{
            console.log(data);
            this.submitLoading=false;
            this.submitText='提交';
            if(data.code === 0){
              //提交成功
              this.$router.push({path:'/thankyou'});//跳到欢迎页
            } else if (data.code === -8){
              this.$notify.error({
                title: '该问卷未发布'
              });
            } else if (data.code === -6){
              this.$notify.error({
                title: '您已提交过该问卷'
              });
            } else {
              this.$notify.error({
                title: '操作失败'
              });
            }
          })
      }
    }
  }
</script>
<style scoped>
  .display{
    text-align: center;
    padding: 20px;
  }
  .display .top{
    color: #606266;
    padding: 0 10px 10px 10px;
    border-bottom: 3px solid #ec978d;
    font-size: 15px;
    line-height: 22px;
    text-align: left;
  }
  .display .content{
    width: 100%;
    max-width: 800px;
    display: inline-block;
    text-align: center;
  }
  .display .box-card{
    text-align: left;
    width: 100%;
    margin:10px 0 10px 0;
  }
  .display .bottom{
    margin: 20px 10px 20px 10px;
    color: #909399;
  }
  .display a:link,a:visited,a:active {
    color: #909399;
    text-decoration:none;
  }
</style>
