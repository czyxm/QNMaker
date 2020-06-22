<template>
  <div class="thankYou">
    <el-card shadow="never" style="font-size: 18px;line-height: 40px;padding: 10px;">
      <i class="el-icon-warning-outline" style="color: yellow;font-size: 50px"></i><br>
      {{message}}<br><br>
      <el-divider></el-divider>
      <el-link type="info" href="/index">由QNMaker提供技术支持</el-link>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: 'Fail',
    data() {
      return {
        message: ''
      }
    },
    mounted() {
      this.message = this.$route.params.message;
    }
  }
</script>
<style scoped>
  .thankYou{
    padding: 40px;
  }
</style>
<style>
  .el-divider--horizontal{
    margin: 10px;
  }
</style>
