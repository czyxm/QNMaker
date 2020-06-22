<template>
  <div class="Count" v-loading="loading" element-loading-text="生成中...">
    <div v-if="detail.length==0">暂时没有数据</div>
    <el-card shadow="hover" class="question">
      <div slot="header" class="clearfix">
        <span>结果概览</span>
      </div>
      <el-table  :data="outline" style="width: 100%" stripe class="table">
        <el-table-column prop="count" label="填写人数" width="120"></el-table-column>
        <el-table-column prop="start" label="起始时间" width="200"></el-table-column>
        <el-table-column prop="end" label="截止时间" width="200"></el-table-column>
        <el-table-column prop="avg" label="平均填写用时(秒)" width="180"></el-table-column>
      </el-table>
    </el-card>
    <el-card shadow="hover" class="question" v-for="(item,index) in detail">
      <div slot="header" class="clearfix">
        <span>{{item.title}}</span>
      </div>

      <div v-if="item.type=='radio'||item.type=='checkbox'">
        <el-table  :data="item.optionResult" style="width: 100%" stripe class="table">
          <el-table-column prop="option" label="选项" width="180"></el-table-column>
          <el-table-column prop="count" label="数量" width="180"></el-table-column>
          <el-table-column prop="percent" label="比例" width="180"></el-table-column>
        </el-table>
        <br>

        <el-dropdown trigger="hover">
          <span class="el-dropdown-link">
            图表类型<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeValue(index,0)">无</el-dropdown-item>
            <el-dropdown-item @click.native="changeValue(index,1)">柱状图</el-dropdown-item>
            <el-dropdown-item @click.native="changeValue(index,2)">扇形图</el-dropdown-item>
            <el-dropdown-item @click.native="changeValue(index,3)">圆环图</el-dropdown-item>
            <el-dropdown-item @click.native="changeValue(index,4)">条形图</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div :id="'img'+(index)" class="img" v-show="visible[index]==1"></div>
        <div :id="'bing'+(index)" class="bing" v-show="visible[index]==2"></div>
        <div :id="'ring'+(index)" class="ring" v-show="visible[index]==3"></div>
        <div :id="'tz'+(index)" class="tz" v-show="visible[index]==4"></div>
      </div>

      <div v-if="item.type=='number'||item.type=='rate'">
        <el-table  :data="[item.numberResult]" style="width: 100%" stripe class="table">
          <el-table-column prop="total" label="数量" width="150"></el-table-column>
          <el-table-column prop="sum" label="总和" width="150"></el-table-column>
          <el-table-column prop="avg" label="均值" width="150"></el-table-column>
          <el-table-column prop="max" label="极大值" width="150"></el-table-column>
          <el-table-column prop="min" label="极小值" width="150"></el-table-column>
        </el-table>
        <br>
      </div>

      <div v-if="item.type=='text'">
        <el-table :data="item.textResult">
          <el-table-column property="context" :label="'共计'+item.textResult.length+'条'"></el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import {designOpera} from './api'
  export default{
    data(){
      return{
        //dialogTableVisible: false,
        visible:[],
        loading:false,
        detail:[],
        outline: []
      }

    },
    mounted(){
//      this.dataAnalysis()
//      console.log(this.visible);

    },
    methods:{
       //切换图表
      changeValue(num,value){
        this.$set(this.visible,num,value);
        console.log('num='+num);
        console.log('value='+value);
        switch (value) {
          case 1: this.setImg(num); break;
          case 2: this.setPar(num); break;
          case 3: this.setRing(num); break;
          case 4: this.setTz(num); break;
        }
      },
//      请求后端数据
      dataAnalysis(id){
          this.loading=true;
          this.detail=[];
          designOpera({
              opera_type:'dataAnalysis',
              username:sessionStorage.getItem('username'),
              questionnaireId:id
          }).then(data=>{
             if (data.code === 0) {
               this.detail=data.detail;
               this.outline=data.outline;
               if (data.outline.length > 0) {
                 this.outline[0].avg = `${(this.outline[0].avg).toFixed(2)}`;
               }
             } else {
               this.$message({
                 type: 'error',
                 message: '操作失败'
               });
             }
            this.visible=[];
            this.loading=false;
          });
      },

      test(){
        console.log(this.visible)
      },

       //柱状图
      setImg(id){
        console.log(id);
        console.log(this.detail[id].optionResult)
        let myChart = echarts.init(document.getElementById('img'+id));
        var option = {
            tooltip: {},
            legend: {
                data:['数量']
            },
            dataset:{
              dimensions: ['option', 'count', 'percent'],
              source:this.detail[id].optionResult
            },
            xAxis: {
                type:'category'
            },
            yAxis: {},
            series: [
              {
                name: '数量：',
                type: 'bar',
                barWidth:30,
                color:'deepskyblue'
              },
            ],
        };
        myChart.setOption(option);
      },
       // 饼状图
      setPar(id){
          let myChart = echarts.init(document.getElementById('bing'+id));
          var option = {
                tooltip : {

                },

                color:['#409EFF', '#FFB54D','#FF7466','#44DB5E'],
                legend: {
                    data:['数量']
                },
                 dataset:{
                      dimensions: ['option', 'count', 'percent'],
                      source: this.detail[id].optionResult,
                    },
                series : [
                    {
                        name: '统计结果：',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
      },
      // 圆环图
      setRing(id){
        //console.log(id);
        let myChart = echarts.init(document.getElementById('ring'+id));
        var option = {
                tooltip: {

                },
                legend: {
                },
                color:['#409EFF', '#FFB54D','#FF7466','#44DB5E'],
                dataset: {
                  dimensions: ['option', 'count', 'percent'],
                  source: this.detail[id].optionResult,
                },
                series: [
                    {
                        name:'数量：',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    }
                ]
            };
        myChart.setOption(option);
      },
      //圆环图
      setTz(id){
        //console.log(id);
        let myChart = echarts.init(document.getElementById('tz'+id));
        var option = {
                  tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                          type: 'shadow'
                      }
                  },
                  dataset: {
                  dimensions: ['option', 'count', 'percent'],
                  source: this.detail[id].optionResult,
                },
                  grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                  },
                  xAxis: {
                      type: 'value',
                      boundaryGap: [0, 0.01]
                  },
                  yAxis: {
                      type: 'category',
                  },
                  series: [
                      {
                          name: '数量：',
                          type: 'bar',
                          barWidth:30,
                          color:'#409EFF'
                      }
                  ]
              };
        myChart.setOption(option);
      },
      //文本内容
      setText(id){
         return{
           result: this.detail[id].result,
         }

      }
    }
  }
</script>
<style scoped>
  .Count{

  }
  .Count .question{
    max-width: 800px;
    width: 80%;
    display: inline-block;
    margin: 10px;
    text-align: left;
  }
  .Count .table{

  }
  .Count .img{
    width: 500px;
    height: 300px;
  }
  .Count .bing{
    width: 500px;
    height: 300px;
  }
  .Count .ring{
    width: 500px;
    height: 300px;
  }
  .Count .tz{
    width: 500px;
    height: 300px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
</style>
