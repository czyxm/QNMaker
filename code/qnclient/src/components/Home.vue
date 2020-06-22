<template>
  <div class="home">
    <el-row>
      <el-col :span="6">
        <div class="opera">
          <el-tooltip class="item" effect="dark" content="创建问卷" placement="bottom">
            <el-button icon="el-icon-plus" type="text" class="rightButton" @click="addWjButtonClick">创建问卷</el-button>
          </el-tooltip>
        </div>

        <!--左侧导航栏-->
        <el-menu :default-active="defaultActive.toString()" v-loading="loading" class="menu">
          <!--问卷列表-->
          <div style="width:100%;text-align: center;font-size: 15px;line-height: 20px;margin-top: 20px;color: #303133" v-if="nowSelect._id==0||nowSelect._id==null">
            点击上方&nbsp;+&nbsp;创建第一个问卷
          </div>
          <el-menu-item v-for="(item,index) in wjList" :index="(index+1).toString()" @click="wjClick(item._id,index)">
            <i class="el-icon-tickets"></i>
            <span slot="title" style="display: inline-block">
              {{item.title}}
              <span style="color: #F56C6C;font-size: 13px;" v-if="item.status==0">
                <i class="el-icon-link" style="margin:0;font-size: 13px;color: #F56C6C;width:10px;"></i>
                未发布
              </span>
              <span style="color: #67C23A;font-size: 13px;" v-if="item.status==1">
                <i class="el-icon-link" style="margin:0;font-size: 13px;color: #67C23A;width:10px;"></i>
                已发布
              </span>
              <span class="inline-button">
                <el-button icon="el-icon-view" type="text" class="rightButton" @click="previewWj(item._id)" ></el-button>
                <el-button icon="el-icon-delete" type="text" class="rightButton" @click="deleteWj(item._id)"></el-button>
              </span>
            </span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="18">
        <!--标签页-->
         <el-tabs type="border-card" v-model="activeName" @tab-click="handleTabsClick">
            <el-tab-pane name="design">
              <span slot="label"><i class="el-icon-edit"></i> 设计</span>
              <div class="content">
                <div v-show="nowSelect._id==0||nowSelect._id==null">请先选择问卷</div>
                <design ref="design" v-show="nowSelect._id!=0&&nowSelect._id!=null"></design>
              </div>
            </el-tab-pane>

           <el-tab-pane name="config">
             <span slot="label"><i class="el-icon-setting"></i> 配置</span>
             <div class="content" ref="pdf">
               <div v-show="nowSelect._id==0||nowSelect._id==null">请先选择问卷</div>
               <div v-show="nowSelect._id!=0&&nowSelect._id!=null">
                 <el-form ref="form" :model="willAddWj" label-width="150px">
                   <el-form-item label="问卷标题" style="width: 100%;" required>
                     <el-input v-model="willAddWj.title" placeholder="请输入问卷标题" ></el-input>
                   </el-form-item>
                   <el-form-item label="问卷描述" style="width: 100%;">
                     <el-input v-model="willAddWj.description" type="textarea" placeholder="请输入问卷描述" rows="5"></el-input>
                   </el-form-item>
                   <el-form-item label="仅限注册用户" style="width: 100%;text-align: left">
                     <el-switch v-model="willAddWj.onlyRegister" active-color="#13ce66" inactive-color="#aaaaaa"></el-switch>
                   </el-form-item>
                   <div v-if="willAddWj.onlyRegister === false" style="width: 100%;text-align: left">
                     <el-form-item label="单个用户填写上限">
                       <el-input-number v-model="willAddWj.eachIpUpperBound" :min="1" :max="10"></el-input-number>
                     </el-form-item>
                     <el-form-item label="按天计算">
                       <el-switch v-model="willAddWj.eachDay" active-color="#13ce66" inactive-color="#aaaaaa"></el-switch>
                     </el-form-item>
                   </div>
                 </el-form>
                 <div style="width: 100%;text-align: center">
                   <el-button type="primary" plain round @click="addWj">保存</el-button>
                 </div>
               </div>
             </div>
           </el-tab-pane>

           <el-tab-pane name="publish">
             <span slot="label"><i class="el-icon-share"></i> 发布</span>
             <div class="content" ref="pdf">
               <div v-show="nowSelect._id==0||nowSelect._id==null">请先选择问卷</div>
               <div v-show="nowSelect._id!=0&&nowSelect._id!=null">
                 <el-form ref="form" :model="shareInfo" label-width="80px">
                   <el-form-item label="问卷链接" style="width: 100%;">
                     <el-row>
                       <el-col :span="16">
                         <el-input v-model="shareInfo.url" readonly></el-input>
                       </el-col>
                       <el-col :span="8">
                         <el-button style="margin-left: 5px;" v-clipboard:copy="shareInfo.url" v-clipboard:success="copySuccess" v-clipboard:error="copyError">复制</el-button>
                         <el-button style="margin-left: 5px;" @click="openShareUrl">打开</el-button>
                       </el-col>
                     </el-row>
                   </el-form-item>
                   <el-form-item label="二维码" style="width: 100%;">
                     <canvas id="canvas" style="width: 150px;height: 150px;"></canvas>
                   </el-form-item>
                 </el-form>
                 <el-button :icon="nowSelect.status==0?'el-icon-video-play':'el-icon-video-pause'" type="primary" plain round @click="publish">
                   {{nowSelect.status==0?'发布问卷':'暂停问卷'}}
                 </el-button>
               </div>
             </div>
           </el-tab-pane>

            <el-tab-pane name="analyze">
              <span slot="label"><i class="el-icon-s-data"></i> 统计</span>
              <div class="content" ref="pdf">
                <div v-show="nowSelect._id==0||nowSelect._id==null">请先选择问卷</div>
                <data-show ref="dataShow" v-show="nowSelect._id!=0&&nowSelect._id!=null"></data-show>
              </div>
            </el-tab-pane>
          </el-tabs>
      </el-col>
    </el-row>

    <!--添加问卷弹窗-->
    <el-dialog title="创建问卷" :visible.sync="dialogShow" :close-on-click-modal="false" class="dialog">
      <el-form ref="form" :model="willAddWj" label-width="150px">
        <el-form-item label="问卷标题" style="width: 100%;" required>
          <el-input v-model="willAddWj.title" placeholder="请输入问卷标题" ></el-input>
        </el-form-item>
        <el-form-item label="问卷描述" style="width: 100%;">
          <el-input v-model="willAddWj.description" type="textarea" placeholder="请输入问卷描述" rows="5"></el-input>
        </el-form-item>
        <el-form-item label="仅限注册用户">
          <el-switch v-model="willAddWj.onlyRegister" active-color="#13ce66" inactive-color="#aaaaaa"></el-switch>
        </el-form-item>
        <div v-if="willAddWj.onlyRegister === false">
          <el-form-item label="单个用户填写上限">
            <el-input-number v-model="willAddWj.eachIpUpperBound" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="按天计算">
            <el-switch v-model="willAddWj.eachDay" active-color="#13ce66" inactive-color="#aaaaaa"></el-switch>
          </el-form-item>
        </div>
      </el-form>
      <div style="width: 100%;text-align: right">
        <el-button style="margin-left: 10px;" @click="dialogShow=false">取消</el-button>
        <el-button type="primary" style="margin-left: 10px;" @click="addWj">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {designOpera} from './api'
  import Design from './Design.vue'
  import DataShow from './DataShow.vue'
  import ElButton from "../../node_modules/element-ui/packages/button/src/button";
  import QRCode from 'qrcode'
  export default{
    components:{
      ElButton,
      Design,
      QRCode,
      DataShow,
    },
    data(){
      return{
        defaultActive:1,//当前激活菜单
        activeName:'design',//标签页当前选择项
        wjList:[],//问卷列表
        loading:false,//是否显示加载中
        dialogShow:false,//添加问卷弹窗是否显示
        tempDialog:false,//模板库弹窗是否显示
        tempData:[],
        tempDataCount:0,
        tempLoading:false,
        tempSearchText:'',
        willAddWj:{
          _id:0,
          title:'',
          description:'感谢您能抽时间参与本次问卷！',
          onlyRegister: false,
          eachIpUpperBound: 1,
          eachDay: false
        },
        shareInfo:{
          url:'',
        },

      }
    },
    mounted(){
      this.getWjList();
      //this.logincheck();
    },
    computed:{
      //现在选中的问卷信息
      nowSelect(){
        if(this.wjList.length===0){
          return {
            _id:null,
            title:null,
            description:null,
            status:null,
            onlyRegister:null,
            eachIpUpperBound:null,
            eachDay:null
          }
        }
        let now=this.wjList[this.defaultActive-1];
        return{
          _id:now._id,
          title:now.title,
          description:now.description,
          status:now.status,
          onlyRegister: now.onlyRegister,
          eachIpUpperBound: now.eachIpUpperBound,
          eachDay: now.eachDay
        }
      },
    },
    methods:{
      //检查登录是否过期
      logincheck(){
          designOpera({
          opera_type:'loginCheck',
        }).then(data=>{
          if(data.code === 404){//如果返回的错误是404，跳转到登录页面
            this.$message({
              type: 'error',
              message: '您还未登录，请登录',
              showClose: true
            });
            this.$router.push({path:'/login'});
          } else if(data.code === 0) {
            sessionStorage.setItem('username', data.username);
            this.getWjList();
          } else {
            console.log(data.msg);
          }
          this.$emit("state");
        })
      },
      //发布问卷/暂停问卷
      publish(){
        let status = 1 - this.nowSelect.status;
        designOpera({
          opera_type:'publishQuestionnaire',
          username:sessionStorage.getItem('username'),
          _id:this.nowSelect._id,
          status:status
        })
          .then(data=>{
            console.log(data);
            if(data.code==0){
              this.$message({
                type: 'success',
                message: status==1?'问卷发布成功！':'问卷暂停成功！'
              });
              this.getWjList();
            }
            else{
              this.$message({
                type: 'error',
                message: data.msg
              });
            }
          })
      },
      handleTabsClick() {
        if (this.nowSelect._id != null) {
          console.log(`Now select ${this.nowSelect._id}`);
          switch (this.activeName) {
            case 'design':
              this.$refs.design.init(this.nowSelect._id,this.nowSelect.title,this.nowSelect.description);
              break;

            case 'publish':
              this.shareInfo.url=window.location.origin+"/display/"+this.nowSelect._id;
              this.makeQrcode();
              break;

            case 'config': this.willAddWj=this.nowSelect; break;

            case 'analyze':
              this.$refs.dataShow.dataAnalysis(this.nowSelect._id);
              break;
          }
        }
      },
      //生成二维码
      makeQrcode(){
        var canvas=document.getElementById('canvas');
        console.log(this.shareInfo.url);
        QRCode.toCanvas(canvas,this.shareInfo.url);
      },
      //复制分享链接成功
      copySuccess(e){
        console.log(e);
        this.$message({
          type: 'success',
          message: '已复制链接到剪切板'
        });
      },
      //复制分享链接失败
      copyError(e){
        console.log(e);
        this.$message({
          type: 'error',
          message: '复制失败'
        });
      },
      //打开分享链接
      openShareUrl(){
        window.open(this.shareInfo.url);
      },
      //预览问卷
      previewWj(questionnaireId){
        let url=window.location.origin+"/display/"+questionnaireId;//问卷链接
        window.open(url);
      },
      //添加问卷按钮点击
      addWjButtonClick(){
        this.dialogShow=true;
        this.willAddWj={
          _id:null,
          title:'',
          description:'感谢您能抽时间参与本次问卷!',
          onlyRegister: false,
          eachIpUpperBound: 1,
          eachDay: false
        };
      },
      //添加问卷
      addWj(){
        if (this.willAddWj.title === ''){
          this.$message({
            type: 'error',
            message: '请输入问卷标题'
          });
          return;
        }
        designOpera({
          opera_type:'addQuestionnaire',
          username:sessionStorage.getItem('username'),
          _id:this.willAddWj._id,
          title:this.willAddWj.title,
          description:this.willAddWj.description,
          onlyRegister: this.willAddWj.onlyRegister,
          eachIpUpperBound: this.willAddWj.eachIpUpperBound,
          eachDay: this.willAddWj.eachDay
        })
          .then(data=>{
            if(data.code==0){
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.getWjList();
            }
            else{
              this.$message({
                type: 'error',
                message: data.msg
              });
            }
          });
        this.dialogShow=false;
      },
      //获取问卷列表
      getWjList(){
        this.loading=true;
        designOpera({
          opera_type:'getQuestionnaireList',
          username:sessionStorage.getItem('username')
        }).then(data=>{
            this.loading=false;
            if (data.code == 0) {
              this.wjList=data.detail;
              this.lookDetail();
            } else {
              this.$message({
                type: 'error',
                message: data.msg
              });
            }
          })
      },
      //删除问卷
      deleteWj(questionnaireId){
        this.$confirm('确定删除? 删除后不可恢复！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          designOpera({
          opera_type:'deleteQuestionnaire',
          username:sessionStorage.getItem('username'),
          _id:questionnaireId
        })
          .then(data=>{
            if(data.code === 0){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.loading = false;
              this.getWjList();
              this.defaultActive = 1;
              this.handleTabsClick();
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
      //问卷点击
      wjClick(_id,index){
        this.defaultActive=(index+1).toString();
        this.handleTabsClick();
      },
    }
  }
</script>
<style scoped>
  .home{
    position: absolute;
    width: 100%;
    height: calc(100vh - 100px);
    text-align: left;

  }
  .home .badgeItem{
    margin-top: 40px;
  }
  .content{
    padding: 20px;
    padding-right: 50px;
    height: calc(100vh - 175px);
    text-align: center;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .menu{
    background-color: white;
    height: calc(100vh - 100px);
    overflow-x: scroll;
    overflow-y: scroll;
    left: 0;
  }
  .home .opera{
    position: relative;
    background-color: #fafafa;
    text-align: center;
    height: 40px;
  }
  .home .rightButton{
    font-size: 16px;
  }
  .home .addWjDiv{
    height: 50px;line-height: 50px;text-align: center;
    border-bottom: 1px solid #eee
  }
  .inline-button {
    position: absolute;
    right: 10px;
    cursor: pointer;
  }
</style>
