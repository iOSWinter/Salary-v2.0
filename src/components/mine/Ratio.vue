<template>
    <div id="ratio" v-loading="loading">
        <h4>{{setting}}缴费比例</h4>

        <div class="item">
            <p>缴费项目</p>
            <p>个人缴费</p>
            <p>单位缴费</p>
            <p>缴费基数</p>
        </div>
        <div class="item">
            <p>养老保险(%)</p>
            <input v-model="retirement" type="number" name="" min="0" placeholder="请输入">
            <input v-model="retirementC" type="number" name="" min="0" placeholder="请输入">
            <input v-model="retirementBase" type="number" name="" min="0" placeholder="请输入">
        </div>
        <div class="item">
            <p>医疗保险(%)</p>
            <input v-model="medical" type="number" name="" min="0" placeholder="请输入">
            <input v-model="medicalC" type="number" name="" min="0" placeholder="请输入">
            <input v-model="medicalBase" type="number" name="" min="0" placeholder="请输入">
        </div>
        <div class="item">
            <p>失业保险(%)</p>
            <input v-model="unemployment" type="number" name="" min="0" placeholder="请输入">
            <input v-model="unemploymentC" type="number" name="" min="0" placeholder="请输入">
            <input v-model="unemploymentBase" type="number" name="" min="0" placeholder="请输入">
        </div>
        <div class="item">
            <p>生育保险(%)</p>
            <input v-model="birth" type="number" name="" min="0" placeholder="请输入">
            <input v-model="birthC" type="number" name="" min="0" placeholder="请输入">
            <input v-model="birthBase" type="number" name="" min="0" placeholder="请输入">
        </div>
        <div class="item">
            <p>工伤保险(%)</p>
            <input v-model="industrialInjury" type="number" name="" min="0" placeholder="请输入">
            <input v-model="industrialInjuryC" type="number" name="" min="0" placeholder="请输入">
            <input v-model="industrialInjuryBase" type="number" name="" min="0" placeholder="请输入">
        </div>
        <div class="item">
            <p>大病医疗(%)</p>
            <input v-model="bigMedical" type="number" name="" min="0" placeholder="请输入">
            <input v-model="bigMedicalC" type="number" name="" min="0" placeholder="请输入">
            <input v-model="bigMedicalBase" type="number" name="" min="0" placeholder="请输入">
        </div>
        <div class="item">
            <p>住房公积(%)</p>
            <input v-model="houseFund" type="number" name="" min="0" placeholder="请输入">
            <input v-model="houseFundC" type="number" name="" min="0" placeholder="请输入">
            <input v-model="houseFundBase" type="number" name="" min="0" placeholder="请输入">
        </div>

        <div class="bottom">
            <a @click="submitClick">提交</a>
        </div>
        
        <tabbar :homeShow="false" :mineSelected="true"></tabbar>
    </div>
</template>

<script>
import Tabbar from '../tabbar/Tabbar'
export default {
    components:{
        Tabbar
    },
    data(){
        return {
            loading:false,
            setting:'设置',
            retirement:0,
            medical:0,
            unemployment:0,
            birth:0,
            industrialInjury:0,
            bigMedical:0,
            houseFund:0,
            retirementC:0,
            medicalC:0,
            unemploymentC:0,
            birthC:0,
            industrialInjuryC:0,
            bigMedicalC:0,
            houseFundC:0,
            retirementBase:0,
            medicalBase:0,
            unemploymentBase:0,
            birthBase:0,
            industrialInjuryBase:0,
            bigMedicalBase:0,
            houseFundBase:0,
        }
    },
    methods:{
        submitClick(){
            this.loading = true;
            this.http.post("/InsuranceRatio/UpdateInsuranceRatio",{data:{
                retirement:this.retirement,
                medical:this.medical,
                unemployment:this.unemployment,
                birth:this.birth,
                industrialInjury:this.industrialInjury,
                bigMedical:this.bigMedical,
                houseFund:this.houseFund,
                retirementC:this.retirementC,
                medicalC:this.medicalC,
                unemploymentC:this.unemploymentC,
                birthC:this.birthC,
                industrialInjuryC:this.industrialInjuryC,
                bigMedicalC:this.bigMedicalC,
                houseFundC:this.houseFundC,
                retirementBase:this.retirementBase,
                medicalBase:this.medicalBase,
                unemploymentBase:this.unemploymentBase,
                birthBase:this.birthBase,
                industrialInjuryBase:this.industrialInjuryBase,
                bigMedicalBase:this.bigMedicalBase,
                houseFundBase:this.houseFundBase
            }})
            .then(res => {
                this.loading = false;
                if(res.statusCode == 200){
                    this.$message({
                        message:res.message,
                        type: "success",
                        duration: 600
                    });
                    setTimeout(() => {
                        this.$router.push({name:'mineLink'});
                    }, 600);
                }else{
                    this.$message({
                        message:res.message,
                        type: "warning",
                    });
                }
            })
            .catch(err => {
                this.loading = false;
                this.$message({
                    message:"网络错误",
                    type: "error",
                });
            })
        }
    },
    created(){
        this.loading = true;
        this.http.post("/InsuranceRatio/GetInsuranceRatio")
        .then(res => {
            this.loading = false;
            if(res.statusCode == 200){
                this.retirement = res.result.retirement;
                this.medical = res.result.medical;
                this.unemployment = res.result.unemployment;
                this.birth = res.result.birth;
                this.industrialInjury = res.result.industrialInjury;
                this.bigMedical = res.result.bigMedical;
                this.houseFund = res.result.houseFund;
                this.retirementC = res.result.retirementC;
                this.medicalC = res.result.medicalC;
                this.unemploymentC = res.result.unemploymentC;
                this.birthC = res.result.birthC;
                this.industrialInjuryC = res.result.industrialInjuryC;
                this.bigMedicalC = res.result.bigMedicalC;
                this.houseFundC = res.result.houseFundC;
                this.retirementBase = res.result.retirementBase;
                this.medicalBase = res.result.medicalBase;
                this.unemploymentBase = res.result.unemploymentBase;
                this.birthBase = res.result.birthBase;
                this.industrialInjuryBase = res.result.industrialInjuryBase;
                this.bigMedicalBase = res.result.bigMedicalBase;
                this.houseFundBase = res.result.houseFundBase;
            }else{
                this.$message({
                    message:res.message,
                    type: "warning",
                });
            }
        })
        .catch(err => {
            this.loading = false;
            this.$message({
                message:"网络错误",
                type: "error",
            });
        });
    }
}
</script>

<style scoped>
    *{
        margin: 0;
        padding: 0;
    }
    #ratio{
        width: 100%;
        min-height: 100%;
        background-color: cadetblue;
    }
    h4{
        color: white;
        text-align: center;
        margin: 10px auto;
        letter-spacing: 5px;
    }

    .item{
        color: white;
    }
    .item>p,.item>input{
        float: left;
        font-size: 14px;
    }
    .item>p:nth-child(1){
        width:80px;
        margin: 10px 3px;
        height: 25px;
        line-height: 20px;
    }
    .item>p:nth-child(2),.item>p:nth-child(3),.item>p:nth-child(4),.item>input{
        width:calc((100% - 125px) / 3);
        margin: 10px 3px;
        border-radius: 5px;
        border: none;
        height: 25px;
        line-height: 20px;
        padding-left: 3px;
    }
    .item>input{
        color: #555;
    }
    
    .bottom{
        clear: both;
        height: 60px;
        margin-bottom: 50px;
    }
    .bottom>a{
        text-decoration: none;
        margin-top: 10px;
        display: inline-block;
        width: 90%;
        background: green;
        height: 40px;
        line-height: 40px;
        color: white;
        font-size: 20px;
        border-radius: 5px;
    }

</style>