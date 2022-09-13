<template>
    <div id="home" v-loading="loading">
        <home-summary :summary="summary"></home-summary>
        <month v-for="item in monthList" :key="item.month" :monthData="item" @checkDetail="checkSalaryDetail"></month>
        <div class="load-more" @click="getMonthList">{{loadMoreText}}</div>
        <tabbar :homeShow="true" :homeSelected="true"></tabbar>
        
        <el-dialog class="roll-dialog" @close="detailDialogVisible = false" :title="detailTitle" :visible="detailDialogVisible" width=70% :show-close="false">
            <div class="detail-scroll">
                <el-button @click="editRecord" type="primary" plain size="small">编辑</el-button>
                <el-popconfirm :title="deleteConfirmTitle" confirm-button-text="确定" confirm-button-type="warning" cancel-button-text="取消" cancel-button-type="info" @confirm="deleteAction">
                    <el-button @click="deleteRecord" slot="reference" type="danger" plain size="small">删除</el-button>            
                </el-popconfirm>

                <p class="detail-title">个人情况</p>
                <el-table :data="personalData" :show-header="false" size="small">
                    <el-table-column property="item" width="110"></el-table-column>
                    <el-table-column property="value" ></el-table-column>
                </el-table>
                <p class="detail-title">公司情况</p>
                <el-table :data="companyData" :show-header="false" size="small">
                    <el-table-column property="item" width="110"></el-table-column>
                    <el-table-column property="value" ></el-table-column>
                </el-table>
                <p class="detail-title">综合情况</p>
                <el-table :data="summaryData" :show-header="false" size="small">
                    <el-table-column property="item" width="110"></el-table-column>
                    <el-table-column property="value" ></el-table-column>
                </el-table>
            </div>
        </el-dialog>            
    </div>
    
</template>


<script>

import HomeSummary from './HomeSummary'
import Month from './Month'
import Tabbar from '../tabbar/Tabbar'

export default {
    components:{
        HomeSummary,
        Month,
        Tabbar
    },
    data(){
        return{
            summary:{real:0,theory:0,avg:0,insurance:0,tax:0},
            monthList:[],
            lastMonth:'',
            loadMoreText:'加载更多',
            loading:false,
            detailTitle:"",
            detailDialogVisible: false,
            personalData: [],
            companyData: [],
            summaryData: [],
            detailMonth:"",
            detailId:"",
            deleteConfirmTitle:""
        }
    },
    methods:{
        getSalarySummary(){
            this.http.post("/Salary/GetSalarySummary")
            .then(res=>{
                this.summary.real = res.result.real;
                this.summary.theory = res.result.theory;
                this.summary.avg = res.result.avg;
                this.summary.insurance = res.result.insurance;
                this.summary.tax = res.result.tax;
            })
            .catch(err =>{
                this.$message({
                    message:"获取汇总失败",
                    type:"error"
                });
            })
        },
        getMonthList(){
            if(this.loadMoreText == '无更多数据'){
                return;
            }
            this.loading = true;
            this.loadMoreText = '正在加载...';
            this.http.post("/Salary/GetMonthList",{data:{startDate:this.lastMonth}})
            .then(res => {
                this.loading = false;
                if(res.result.length > 0){
                    if(this.monthList.length > 0){
                        this.$message({
                            message:res.message,
                            type:"success"
                        });
                    }
                    this.monthList.push(...res.result);
                } else {
                    this.loadMoreText = '无更多数据';
                }
                if(this.monthList.length > 0){
                    this.lastMonth = this.monthList[this.monthList.length - 1].month;
                }
            })
            .catch(err => {
                this.loading = false;
                this.$message("获取列表失败");
            })
            .finally(() => {
                if(this.loadMoreText != '无更多数据'){
                    this.loadMoreText = '加载更多';
                }
            })
        },
        checkSalaryDetail(id){
            this.loading = true;
            this.http.post("/Salary/GetMonthDetail",{data:{monthId:id}})
            .then(res => {
                this.loading = false;
                this.showDetail(res.result,id);
            })
            .catch(err => {
                this.loading = false;
                this.$message("网络错误");
            });
        },
        editRecord(){
            this.detailDialogVisible = false;
            this.$router.push({name:'addsalaryLink',params:{add : false,id : this.detailId}});
        },
        deleteRecord() {
            this.deleteConfirmTitle = `确定删除${this.detailMonth}的记录？`;
        },
        deleteAction(){
            let that = this;
            that.loading = true;
            that.detailDialogVisible = false;
            that.http.post("/Salary/DeleteMonthSalary",{data:{monthId:that.detailId}})
            .then(res => {
                that.loading = false;              
                this.$message({
                    type: 'success',
                    message: '删除成功!',
                    duration:600
                });
                let index = -1;
                for (let i = 0; i < that.monthList.length; i++) {
                    let month = that.monthList[i];
                    if(month.id == that.detailId){
                        index = i;
                        break;
                    }
                }
                if(index >= 0){
                    that.monthList.splice(index,1);
                }
                that.getSalarySummary();
            })
            .catch(err => {     
                that.loading = false;               
                this.$message({
                    type: 'error',
                    message: '网络错误!'
                });
            })
        },
        showDetail(jsonSalary,id){
            let that = this;
            this.detailMonth = jsonSalary.month;
            this.detailId = id;
            this.detailDialogVisible = true;
            this.detailTitle = jsonSalary.month + " 记录详情";
            this.personalData = [
                {
                    item: '基本工资',
                    value: (parseFloat(jsonSalary.baseSalary)).toFixed(2)
                },
                {
                    item: '加项',
                    value: jsonSalary.increase.toFixed(2)
                },
                {
                    item: '减项',
                    value: jsonSalary.reduce.toFixed(2)
                },
                {
                    item: '奖金',
                    value: jsonSalary.reward.toFixed(2)
                },
                {
                    item: '餐费',
                    value: jsonSalary.meal.toFixed(2)
                },
                {
                    item: '养老保险',
                    value: jsonSalary.retirement.toFixed(2)
                },
                {
                    item: '医疗保险',
                    value: jsonSalary.medical.toFixed(2)
                },
                {
                    item: '失业保险',
                    value: jsonSalary.unemployment.toFixed(2)
                },
                {
                    item: '生育保险',
                    value: jsonSalary.birth.toFixed(2)
                },
                {
                    item: '工伤保险',
                    value: jsonSalary.industrialInjury.toFixed(2)
                },
                {
                    item: '大病医疗',
                    value: jsonSalary.bigMedical.toFixed(2)
                },
                {
                    item: '五险合计',
                    value: (jsonSalary.personalInsuranceTotal).toFixed(2)
                },
                {
                    item: '住房公积金',
                    value: jsonSalary.houseFund.toFixed(2)
                },
                {
                    item: '五险一金合计',
                    value: jsonSalary.personalTotal.toFixed(2)
                }
            ];
            this.companyData = [
                {
                    item: '公司名称',
                    value: jsonSalary.company
                },
                {
                    item: '养老保险',
                    value: jsonSalary.retirementC.toFixed(2)
                },
                {
                    item: '医疗保险',
                    value: jsonSalary.medicalC.toFixed(2)
                },
                {
                    item: '失业保险',
                    value: jsonSalary.unemploymentC.toFixed(2)
                },
                {
                    item: '生育保险',
                    value: jsonSalary.birthC.toFixed(2)
                },
                {
                    item: '工伤保险',
                    value: jsonSalary.industrialInjuryC.toFixed(2)
                },
                {
                    item: '大病医疗',
                    value: jsonSalary.bigMedicalC.toFixed(2)
                },
                {
                    item: '五险合计',
                    value: (jsonSalary.companyInsuranceTotal).toFixed(2)
                },
                {
                    item: '住房公积金',
                    value: jsonSalary.houseFundC.toFixed(2)
                },
                {
                    item: '五险一金合计',
                    value: jsonSalary.companyTotal.toFixed(2)
                }
            ];
            this.summaryData = [
                {
                    item: '个人所得税',
                    value: jsonSalary.tax.toFixed(2)
                },
                {
                    item: '五险合计',
                    value: (jsonSalary.personalInsuranceTotal + jsonSalary.companyInsuranceTotal).toFixed(2)
                },
                {
                    item: '公积金合计',
                    value: (jsonSalary.houseFund + jsonSalary.houseFundC).toFixed(2)
                },
                {
                    item: '五险一金合计',
                    value: (jsonSalary.companyTotal + jsonSalary.personalTotal).toFixed(2)
                },
                {
                    item: '应发薪资',
                    value: (parseFloat(jsonSalary.theory)).toFixed(2)
                },
                {
                    item: '实发薪资',
                    value: (parseFloat(jsonSalary.real)).toFixed(2)
                }
            ];
        }
    },

    created(){
        this.getSalarySummary();
        this.getMonthList();
    }
}
</script>

<style scoped>
    #home{
        width: 100%;
        background-color: #eee;
    }
    .load-more{
        height: 40px;
        color: #aaa;
        line-height: 40px;
        margin-bottom: 50px;
    }
    .roll-dialog .el-dialog__body{
        padding: 0 !important;
    }
    .detail-scroll{
        height: 400px;
        overflow: auto;
    }
    .detail-title{
        text-align: left;
        font-size: 16px;
        font-weight: bold;
        padding-top: 15px;
    }

</style>