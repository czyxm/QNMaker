<template>
  <div class="login">
    <el-card class="main_login">
      <div slot="header" class="clearfix">
        <div class="link">
          <el-link type="danger" :underline="false" href="/register">注册新账号</el-link>
        </div><br/>
        <div class="title">登 录 QNMaker</div>
      </div>
      <el-row type="flex" justify="center">
        <el-form ref="loginForm" :rules="rules" :model="loginForm">
            <el-form-item prop="username">
                <el-input @keyup.enter.native="login('loginForm')" icon="el-icon-search" placeholder="请输入用户名" v-model="loginForm.username">
                  <i class="el-icon-user" slot="prefix"> </i>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input @keyup.enter.native="login('loginForm')" placeholder="请输入密码" v-model="loginForm.password" show-password>
                  <i class="el-icon-lock" slot="prefix"> </i>
                </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="login('loginForm')" style="text-align: center;width: 150px" round plain>登  录</el-button>
            </el-form-item>
          </el-form>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import {designOpera} from './api'
  import { Loading } from 'element-ui';
  export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          {required: true,message: '账号不能为空', trigger: 'blur'},
          {min: 6, message: '账号长度最少为6位', trigger: 'blur' },
          { max: 20, message: '账号长度最长20位', trigger: 'blur' }
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
      },
    }
  },
  mounted() {
    //this.logincheck();
  },
  methods: {
      logincheck(){
        designOpera({
          opera_type:'loginCheck',
        }).then(data=>{
          if (data.code === 0) {
            this.$router.push({path:'/home'});
            sessionStorage.setItem('username',data.username);
          } else {
            console.log(data.msg);
          }
          this.$emit("state");
        })
      },
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          designOpera({
            opera_type:'login',
            username:this.loginForm.username,
            password:this.$md5(this.loginForm.password),
          })
            .then(data=>{
              if (data.code === 0) {
                this.$notify({
                  type: 'success',
                  message: '欢迎你,' + this.loginForm.username + '!',
                  duration: 3000
                });
                this.$router.push({path:'/home'});
                sessionStorage.setItem("username",this.loginForm.username);
                this.$emit("state");
              } else {
                if(data.code === -5){
                    this.$message({
                    type: 'error',
                    message: '您还未注册账户，请注册',
                    showClose: true
                  });
                } else if(data.code === -3){
                  this.$message({
                    type: 'error',
                    message: '密码错误',
                    showClose: true
                  });
                } else {
                    this.$message({
                    type: 'error',
                    message: '该用户被禁',
                    showClose: true
                  });
                }
              }
            })
        } else {
          return false;
        }
      })
    },
  }
}
</script>

<style scoped>
  .login {
    position: absolute;
    width:100%;
    height:100%;
    background-color: #E4E7ED;
  }
  .title {
    font-size: large;
    text-align: center;
    color:black;
  }
  .main_login {
    position: absolute;
    left:48%;
    top:40%;
    width:320px;
    height:250px;
    margin:-190px 0 0 -190px;
    padding:40px;
    border-radius: 5px;
    background: #F2F6FC;
  }
  .el-form {
    padding-top: 5%;
    padding-left: 10%;
    padding-right: 10%;
    width:280px;
  }
  .el-row {
    height: 100%;
    width: 100%;
  }
  .link{
    margin-top: -13%;
    text-align: right;
    margin-left: -5%;
  }
  .el-link{
    margin-left: 8px;
    line-height: 20px;
    font-size: 14px;
  }
</style>
