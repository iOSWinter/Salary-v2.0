<template>
    <div id="summary" v-loading="loading">
        
        <div class="top">
            <a @click="filterClick">
                <p>{{startDate}}—{{endDate}}</p>
            </a>            
        </div>
        <div style="text-align:right;margin-right:20px;margin-top:20px;">
            <el-popconfirm title="请选择是否显示金额保存图片？" confirm-button-text="显示" confirm-button-type="warning" cancel-button-text="隐藏" cancel-button-type="primary" @confirm="shareImage(true)" @cancel="shareImage(false)">           
                <el-button type="primary" slot="reference" size="medium">分享图片</el-button>
            </el-popconfirm>
        </div>
        <div id="chart"></div>  
        
        <div class="sum">
            <div>
                <p>个人收入</p>
                <p>{{income.toFixed(2)}}</p>
            </div>
            <div>
                <p>个人缴费</p>
                <p>{{outcome.toFixed(2)}}</p>
            </div>
            <div>
                <p>公司成本</p>
                <p>{{companyOutcome.toFixed(2)}}</p>
            </div>
        </div>
        
        <el-dialog @close="imgDialogVisible = false" title="图片生成成功，长按保存图片" :visible="imgDialogVisible" width=80% :show-close="false">
            <img class="img-area" :src="imgsrc">
        </el-dialog> 

        <tabbar :homeShow="false" :summarySelected="true"></tabbar>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import Tabbar from '../tabbar/Tabbar'

let chart;

export default {
    components:{
        Tabbar
    },
    data(){
        return{
            xValues:[],
            values:[],
            income:0,
            outcome:0,
            companyOutcome:0,
            items:[],
            defaultItems:["theorySalary","mealCost","retirement","medical","unemployment","birth","industrialInjury","bigMedical","houseFund","tax","theorySalaryC","retirementC","medicalC","unemploymentC","birthC","industrialInjuryC","bigMedicalC","houseFundC"],
            startDate:'',
            endDate:'',
            myChart:'',
            reload: false,
            loading:false,
            imgDialogVisible: false,
            imgsrc:''
        }
    },
    mounted(){
        let date = new Date();
        if(this.$route.params.startDate != undefined){
            if(this.startDate != this.$route.params.startDate){
                this.reload = true;
            }
            this.startDate = this.$route.params.startDate;
        } else {
            this.startDate = `${date.getFullYear() - 1}年${date.getMonth() + 1}月`;
        }

        if(this.$route.params.endDate != undefined){
            if(this.endDate != this.$route.params.endDate){
                this.reload = true;
            }
            this.endDate = this.$route.params.endDate;
        } else {
            this.endDate = `${date.getFullYear()}年${date.getMonth() + 1}月`;
        }

        let items = this.$route.params.items;
        items = items ? items : this.defaultItems;
        if(items.sort().toString() != this.items.sort().toString()){
            this.reload = true;
            this.items.length = 0;
            this.items.push(...items);
        }
        this.fetchTotalSummary();
    },
    methods: {
        fetchTotalSummary(){

            if(this.reload){
                this.loading = true;
                this.http.post("/Salary/GetTotalSummary",{data:{startDate:this.startDate,endDate:this.endDate,items:this.items}})
                .then(res => {
                    this.loading = false;
                    this.reload = false;
                    this.xValues = res.result.keys;
                    this.values = res.result.innerData;
                    this.income = res.result.totalIncome;
                    this.outcome = res.result.totalOutcome;
                    this.companyOutcome = res.result.totalCompanyOutcome;
                    this.drawLineByData();
                })
                .catch(err => {
                    this.reload = false;
                    this.loading = false;
                    this.$message({
                        message:"网络错误",
                        type:"error"
                    });
                })
                this.drawLine();
            }
        },
        filterClick(e){
            let title = e.target.innerText;
            let index = title.indexOf("—");
            
            this.$router.push({name:'summaryfilterLink', params:{startDate:title.substring(0,index),endDate:title.substring(index + 1,title.length),items:this.items}});
        },
        drawLine(){
            let myChart = echarts.init(document.getElementById('chart'), 'macarons');
            myChart.optionNoImage = null;
            myChart.option = null;
            this.myChart = myChart;
        },
        shareImage(showCash){
            if(showCash){
                this.showCash();
            }else{
                this.hiddenCash();
            }
        },
        hiddenCash(){
            this.myChart.setOption(this.myChart.optionNoImage);
            let image = this.myChart.getDataURL();
            this.saveImageSuccess(image);
            this.myChart.setOption(this.myChart.option);
        },
        showCash(){
            let image = this.myChart.getDataURL();
            this.saveImageSuccess(image);
        },
        saveImageSuccess(img){   
            this.imgDialogVisible = true;
            this.imgsrc = img;
        },
        drawLineByData(){

            let option = {
                tooltip : {
                    trigger: 'axis'
                },
                color: ["#32cd32", "#da70d6", "#ff7f50"],
                xAxis : [
                    {
                        boundaryGap: true,
                        data : this.xValues
                    }
                ],
                grid: {
                    x: 55
                },
                yAxis : {
                    axisLabel: {
                        show: true,
                    }
                },
                series : [
                    {
                        symbol: 'none',
                        smooth: true,
                        type:'line',
                        data:this.values.income
                    },
                    {
                        symbol: 'none',
                        smooth: true,
                        type:'line',
                        data:this.values.outcome
                    },
                    {
                        symbol: 'none',
                        smooth: true,
                        type:'line',
                        data:this.values.companyOutcome
                    }
                ]
            };
            this.myChart.optionNoImage = {
                tooltip: {
                    trigger: 'axis'
                },
                color: ["#32cd32", "#da70d6", "#ff7f50"],
                xAxis: {
                    boundaryGap: true,
                    data: this.xValues
                },
                grid: {
                    x: 55
                },
                yAxis: {
                    axisLabel: { show: false }
                },
                series: [
                    {
                        symbol: 'none',
                        smooth: true,
                        type:'line',
                        data:this.values.income
                    },
                    {
                        symbol: 'none',
                        smooth: true,
                        type:'line',
                        data:this.values.outcome
                    },
                    {
                        symbol: 'none',
                        smooth: true,
                        type:'line',
                        data:this.values.companyOutcome
                    }
                ]
            };
            this.myChart.option = option;
            this.myChart.setOption(option);
        }
    }
  }
</script>


<style scoped>
    #summary{
        width:100%;
        height: 100%;
        background-color: white;
    }
    .top{
        height: 50px;
        background-color: cadetblue;
    }
    .top>a{
        color: white;
        font-weight: bold;
    }
    .top p{
        display: inline-block;
        line-height: 50px;
        font-size: 18px;
        margin: 0 5px;
    }
    #chart{
        width: 100%;
        height: 280px;
        margin: 0 auto;
    }

    .sum>div{
        float: left;
        width:calc(100%/3);
        font-size: 18px;
    }
    .sum>div>p:nth-child(1){
        font-size: 18px;
        font-weight: bold;
    }
    .sum>div>p:nth-child(2){
        font-size: 15px;
    }
    .sum>div:nth-child(1)>p{
        color: #32cd32;
    }
    .sum>div:nth-child(2)>p{
        color: #da70d6;
    }
    .sum>div:nth-child(3)>p{
        color: #ff7f50;
    }
    .img-area{
        width: 100%;
    }

</style>