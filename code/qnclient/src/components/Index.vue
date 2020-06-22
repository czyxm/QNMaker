<template>
  <div class="main">
     <el-carousel  height="665px" >
        <el-carousel-item v-for="(item,index) in topImg" :key="index">
            <img :src="item.url" style="width: 100%;height: 100%;" alt="">
          <div class="cover">
            {{item.title}}<br>
            <span style="font-size: 35px">{{item.subTitle}}</span>
          </div>
        </el-carousel-item>
      </el-carousel>

    <el-footer class="bottom">
      <p>Copyright © 2019 <el-link type="primary" :underline="false" href="mailto:cmzyx@zju.edu.cn">QNMaker</el-link>. All rights reserved.</p>
    </el-footer>
  </div>
</template>
<script>
  import {designOpera} from './api'
  export default{
    data(){
      return{
        topImg:[
          {
            'title':'免费在线问卷调查系统',
            'subTitle':'Free Online Questionnaire System',
            'url':'/static/images/bg1.jpg'
          },
          {
           'title':'简单的打开方式',
           'subTitle':'Simple Opening Method',
           'url':'/static/images/bg2.jpg'
          },
          {
           'title':'多样的数据可视化',
           'subTitle':'Diversified data visualization',
           'url':'/static/images/bg3.jpg'
          }
        ]
      }
    },
    methods: {
      logincheck(){
        designOpera({
          opera_type:'loginCheck',
        }).then(data=>{
          if (data.code == 0) {
            sessionStorage.setItem('username',data.username);
            this.$emit("state");
          } else {
            console.log(data.msg);
          }
        })
      }
    },
    mounted() {
      this.logincheck();
    }
  }
</script>
<style scoped>
  .main{
    position: relative;
    width: 100%;
    height: 100%;
  }
 .bottom{
    height: 100px!important;
    background-color: #4b5054;
    color: #9b9ea0;
    position: relative;
    padding: 20px;
  }
  .demoImg{
    width: 800px;
    height:500px;
    /*border-radius: 5px;*/

    margin-top: 20px;
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
  .cover{
    position:absolute;width: 100%;height: 100%;background-color: rgba(0,0,0,0.6);z-index: 100;left: 0;top:0;color: white;font-size: 50px;line-height: 60px;padding-top: 180px;
  }
  .lj{

  }
  .b{
    font-weight: 700;
  }

</style>
