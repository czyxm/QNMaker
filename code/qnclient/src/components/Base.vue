<template>
  <div class="main">
    <el-container>
      <el-header>
        <div class="logo" @click="toIndex">
          <img src="/static/images/logo.png" class="logoImg">
          <span style="color: #303133">QNMaker</span>
        </div>
        <div style="float: right;margin-right: 50px;line-height: 60px;">
          <!-- 未登录时显示 -->
          <template v-if="!showname">
            <el-button class="button" type="text" style="font-size: 15px;" @click="toLogin">登录</el-button>
            <el-button class="button" type="text" style="font-size: 15px;" @click="toRegiste">注册</el-button>
          </template>
          <!-- 登录时显示 -->
          <template v-else>
            <!-- 登录成功，显示用户名 -->
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <!-- 退出登录 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">我的问卷</el-dropdown-item>
                <el-dropdown-item command="b">退出帐户</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </div>
      </el-header>
      <el-main style="padding: 0">
        <router-view @state="state"/>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import {designOpera} from './api'
  export default {
    name:'Base',
    data: function () {
      return {
        showname: false, //登录，注册按钮的显示状态
        username:''  //用户名
      }
    },
    methods:{
      toIndex(){
        this.$router.push({path:'/index'});
      },
      //检查登录是否过期
      logincheck(){
        console.log('Base::::');
        designOpera({
          opera_type:'loginCheck',
        })
        .then(data=>{
          console.log(data);
          if(data.code == 404){//如果返回的错误是404，跳转到登录页面
            this.$message({
              type: 'error',
              message: '您还未登录，请登录',
              showClose: true
            });
            this.$router.push({path:'/login'});
          } else if(data.code == 0){
            sessionStorage.setItem('username', data.username); //将后端传的username存入session
            this.$router.push({path:'/home'});
          } else {
            console.log(data.msg);
          }
          this.state()  // 调用state方法
        })
      },
      // 跳转问卷管理页面方法
      toHome(){
        this.$router.push({path:'/home'})
      },
      // 跳转登录页面方法
      toLogin(){
        this.$router.push({path:'/login'})
      },
      // 跳转注册页面方法
      toRegiste(){
        this.$router.push({path:'/register'})
      },
      //判断session中是否存在数据，存在将showname置为true，否则false
      state(){
        // console.log('state')
        // console.log(sessionStorage.getItem('username'))
        if(sessionStorage.getItem('username')!=null){
          this.showname=true;
          this.username = sessionStorage.getItem('username');
        }
        else {
          this.username = '';
          this.showname = false;
        }
      },
      //下拉菜单操作
      handleCommand(command){
        if(command=='a'){
          this.toHome();
        }
        else if(command=='b'){
          this.exit();
        }
      },
      //登出
      exit(command){
        designOpera({
          opera_type:'exit',  // 操作类型
          username:sessionStorage.getItem('username')  //获取session中的用户名
        })
        .then(data=>{
          // console.log(data);
          if(data.code==0){
            sessionStorage.clear()  //登出成功，清空session
            this.state()  // 调用state方法
            this.toLogin()  // 调用toLogin方法
          }
          else{
            this.$message({  // 报错友好提示
              type: 'error',
              message: '网络错误！',
              showClose: true
            });
          }
        })
      }
    },
    // 页面初始化
    mounted(){
      //this.logincheck();
    },
  }
</script>
<style scoped>
  .main{
    position: absolute;
    width: 100%;
    height: 100%;
  }
  /* logo图片样式 */
  .logoImg{
    width: 30px;
    vertical-align: middle;
  }
  /* logo框样式 */
  .logo{
    height: 60px;
    display: inline-block;
    line-height: 60px;
    font-size: 20px;
    position: absolute;
    left: 100px;
    color: #303133;
    cursor: pointer;
  }
  .el-header{
    border-bottom: 2px solid 	#FA8072;
    background-color: white;
  }
   .el-dropdown-link {
    cursor: pointer;
    color: #FA8072;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .button {
    color: #FA8072;
  }
</style>
