<!--
程序名：问题设计页面
功能：对问卷中问题的添加、编辑、删除
-->
<template>
  <div class="Design" v-loading="loading" element-loading-text="加载中...">
    <h3>{{title}}</h3>
      <div class="top" v-if="description!=''">
        {{description}}
      </div>
    <el-card shadow="hover" class="box-card" v-for="(item,index) in detail" style="margin: 10px;">
        <div slot="header" class="clearfix">
          <div class="questionTitle">
            <!--显示必填标识-->
            <span style="color: #F56C6C;">
              <span v-if="item.must">*</span>
              <span v-else>&nbsp;</span>
            </span>
            <span style="color: black;margin-right: 3px;">{{(index+1)+'.'}}</span>
            {{item.title}}
          </div>
          <div style="float: right;">
            <el-button icon="el-icon-edit" style="padding: 2px" type="text" @click="editorQuestion(item)"></el-button>
            <el-button icon="el-icon-delete" style="padding: 2px;color: #F56C6C" type="text" @click="deleteQuestion(index)"></el-button>
          </div>
        </div>

        <!--单选题展示-->
        <div class="text item" v-if="item.type=='radio'" v-for="(option,index) in item.options">
          <el-radio v-model="item.answer" :label="index" style="margin: 5px;">{{ option.title }}</el-radio>
        </div>

        <!--多选题展示-->
        <el-checkbox-group v-if="item.type=='checkbox'" v-model="item.answer">
          <div class="text item"  v-for="(option,index) in item.options">
            <el-checkbox :label="index" style="margin: 5px;">{{ option.title }}</el-checkbox>
          </div>
        </el-checkbox-group>

        <!--填空题展示-->
        <el-input
          v-if="item.type=='text'"
          type="textarea"
          :rows="item.row"
          resize="none"
          v-model="item.answer">
        </el-input>

        <el-input v-if="item.type=='number'" type="number" v-model="item.answer" style="width: 20%" resize="none"></el-input>

        <el-rate v-if="item.type=='rate'" :max="item.row" v-model="item.answer"></el-rate>

      </el-card>

      <el-button plain round icon="el-icon-circle-plus" @click="addQuestion" style="margin-top: 10px;">添加题目</el-button>

<br><br><br><br><br>

    <!--添加题目弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogShow" :close-on-click-modal="false" class="dialog">
      <el-form ref="form" :model="willAddQuestion" label-width="80px">
        <el-form-item label="题目类型" style="width: 100%;">
          <el-select v-model="willAddQuestion.type" placeholder="请选择题目类型" @change="typeChange">
          <el-option
            v-for="item in allType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="是否必填" style="width: 100%;">
          <el-checkbox v-model="willAddQuestion.must">必填</el-checkbox>
        </el-form-item>
        <el-form-item label="题目标题" style="width: 100%;">
          <el-input v-model="willAddQuestion.title" placeholder="请输入标题" ></el-input>
        </el-form-item>

        <template v-if="willAddQuestion.type=='radio'||willAddQuestion.type=='checkbox'">
          <el-form-item :label="'选项'+(index+1)" v-for="(item,index) in willAddQuestion.options" >
            <el-row>
              <el-col :span="16">
                <el-input  v-model="item.title" placeholder="请输入选项名" style="width: 90%;"></el-input>
              </el-col>
            <el-col :span="8">
              <el-button type="danger" plain class="" @click="deleteOption(index)" >删除选项</el-button>
            </el-col>
            </el-row>

          </el-form-item>
          <el-button type="primary" plain class="addOptionButton" @click="addOption">新增选项</el-button>
        </template>
        <template v-if="willAddQuestion.type=='text'">
          <el-form-item label="填空">
            <el-input type="textarea" :rows="willAddQuestion.row" style="width: 100%" resize="none"></el-input>
          </el-form-item>
          <el-form-item label="行数">
            <el-input-number v-model="willAddQuestion.row" :min="1" :max="10" label="描述文字"></el-input-number>
          </el-form-item>
        </template>

        <template v-if="willAddQuestion.type=='number'">
          <el-form-item label="数字">
            <el-input type="number" :rows="willAddQuestion.row" style="width: 20%" resize="none"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-radio-group v-model="willAddQuestion.numberType">
              <el-radio label="integer">整数</el-radio>
              <el-radio label="real">实数</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>

        <template v-if="willAddQuestion.type=='rate'">
          <el-form-item label="评分">
            <el-rate :max="willAddQuestion.row"></el-rate>
          </el-form-item>
          <el-form-item label="最大值">
            <el-input-number v-model="willAddQuestion.row" :min="1" :max="10" label="描述文字"></el-input-number>
          </el-form-item>
        </template>
      </el-form>
      <br>
      <div style="width: 100%;text-align: right">
        <el-button style="margin-left: 10px;" @click="dialogShow=false">取消</el-button>
        <el-button type="primary" style="margin-left: 10px;" @click="checkAddQuestion">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {designOpera} from './api'
  export default{
    data(){
      return{
        nextId: 1,
        loading:false,//页面加载中
        dialogShow:false,
        dialogTitle:'',
        detail:[],
        questionnaireId:null,
        title:'',
        description:'',
        willAddQuestion:{
          _id:null,
          type:'',
          numberType: 'integer',
          title:'',
          options:[
            {
              title:'',//选项标题
              _id: 0//选项id
            }
          ],
          row:1,
          must:false,//是否必填
        },
        allType:[
          {
            value:'radio',
            label:'单选',
          },
          {
            value:'checkbox',
            label:'多选',
          },
          {
            value:'text',
            label:'文本',
          },
          {
            value:'number',
            label:'数字',
          },
          {
            value:'rate',
            label:'评分',
          }
        ],
      }
    },
    methods:{
      //初始化问卷所有问题
      init(questionnaireId,title,description){
        this.questionnaireId=questionnaireId;
        this.title=title;
        this.description=description;
        this.getQuestionList();
      },
      //获取问题列表(问卷内容)
      getQuestionList(){
        this.detail=[];
        this.loading=true;
        designOpera({
          opera_type:'getQuestionList',
          username:sessionStorage.getItem('username'),
          questionnaireId:this.questionnaireId,
        })
          .then(data=>{
            console.log(data);
            this.detail=data.detail;
            this.loading=false;
          })
      },
      //点击添加问题按钮
      addQuestion(){
        if(this.questionnaireId==null){
          this.$message({
            type: 'error',
            message: '清先创建问卷!'
          });
          return;
        }
        this.dialogTitle='添加题目';
        this.willAddQuestion={
          _id:null,
          type:'',
          numberType:'integer',
          title:'',
          options:[
            {
              title:'',//选项标题
              _id: this.getNextId()//选项id
            }
          ],
          row:1,
          must:false,//是否必填
        };
        this.dialogShow=true;
      },
      //删除问题
      deleteQuestion(index){
        this.$confirm('确定删除此题目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          designOpera({
            opera_type:'deleteQuestion',
            username:sessionStorage.getItem('username'),
            questionnaireId: this.questionnaireId,
            questionId:this.detail[index]._id,
          })
            .then(data=>{
              console.log(data);
              if(data.code==0){
                this.detail.splice(index,1);
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
              else{
                this.$message({
                  type: 'error',
                  message: data.msg
                });
              }
            })
        });

      },
      //确认添加/保存题目
      checkAddQuestion(){
        if (['radio', 'checkbox', 'text', 'number', 'rate'].indexOf(this.willAddQuestion.type) < 0) {
          this.$message({
            type: 'error',
            message: '请选择题目类型'
          });
          return;
        }
        if (this.willAddQuestion.title === ''){
          this.$message({
            type: 'error',
            message: '请输入题目标题'
          });
          return;
        }
        if (this.willAddQuestion.type === 'radio' || this.willAddQuestion.type === 'checkbox') {
          for (let option of this.willAddQuestion.options) {
            if (option.title === '') {
              this.$message({
                type: 'error',
                message: '请输入选项内容'
              });
              return;
            }
          }
        }
        designOpera({
          opera_type:'addQuestion',
          username:sessionStorage.getItem('username'),
          questionnaireId:this.questionnaireId,
          questionId:this.willAddQuestion._id,
          title:this.willAddQuestion.title,
          type:this.willAddQuestion.type,
          numberType:this.willAddQuestion.numberType,
          options:this.willAddQuestion.options,
          row:this.willAddQuestion.row,
          must:this.willAddQuestion.must
        }).then(data=>{
            if(data.code === 0){
              this.dialogShow=false;
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.getQuestionList();
            }
            else{
              this.dialogShow=false;
              this.$message({
                type: 'error',
                message: data.msg
              });
            }
          });
      },
      //点击编辑问题按钮
      editorQuestion(item){
        this.willAddQuestion.title=item.title;
        this.willAddQuestion.type=item.type;
        this.willAddQuestion.options=JSON.parse(JSON.stringify(item.options));
        this.willAddQuestion.text=item.text;
        this.willAddQuestion.row=item.row;
        this.willAddQuestion.must=item.must;
        this.willAddQuestion._id=item._id;
        this.dialogTitle='编辑问题';
        this.dialogShow=true;
      },
      //添加选项
      addOption(){
        this.willAddQuestion.options.push({
          title:'',
          _id:this.getNextId(),
        });
      },
      //删除选项
      deleteOption(index){
        this.willAddQuestion.options.splice(index,1);
      },
      //切换问题类型
      typeChange(value){
        console.log(value);
        if (value === 'rate') {
          this.willAddQuestion.row=5;
        } else {
          this.willAddQuestion.row=1;
        }
        this.willAddQuestion.type=value;
        this.willAddQuestion.text='';
      },
      getNextId() {
        return this.nextId++;
      }
    }
  }
</script>
<style scoped>
  .Design{

  }
  .Design .dialog{
    text-align: left;
  }
  .Design .questionTitle{
    display: inline-block;
    width: 80%;
    font-size: 16px;
    color: #303133;
  }
  .Design .addOptionButton{
    display: inline-block;
    margin-left: 80px;
  }
  .box-card{
    width: 100%;
    text-align: left;
  }
  .Design .top{
    color: #606266;
    margin-left: 20px;
    padding: 0 10px 10px 10px;
    border-bottom: 3px solid #ec978d;
    font-size: 15px;
    line-height: 22px;
    text-align: left;
  }
</style>
