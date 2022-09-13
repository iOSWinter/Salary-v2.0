<template>
    <div id="login" v-loading="loading">
        <form class="login-form">
            <h3>登录使用</h3>
            <el-input class="login-input" v-bind:placeholder="accountHolder" v-model="account" clearable></el-input>
            <el-input class="login-input" v-bind:placeholder="passwordHolder" v-model="password" show-password></el-input>
            <el-button class="login-button" type="success" @click="loginBtnClick">登录使用</el-button>
            <p>{{errMsg}}</p>
            <i @click="registerAccount">没有账号,去注册</i>
            <i @click="forgetPassword">忘记密码</i>
        </form>
        <p class="footer">网站备案信息：<a target="_blank" href="http://www.beian.miit.gov.cn">蜀ICP备19001586号</a></p>
        
    </div>
</template>

<script>
export default {
    data(){
        return {
            accountHolder:'手机号码',
            passwordHolder:'登录密码',
            errMsg:'',
            account:'',
            password:'',
            loading:false
        }
    },
    methods:{
        inputValueChange(){
            this.errMsg = '';
        },
        registerAccount(){
            this.$message("请发送手机号码至微信公众号,等待客服回复")
        },
        forgetPassword(){
            this.$message("暂未开放")
        },
        loginBtnClick(){
            if(this.account.length <= 0){
                this.errMsg = '手机号码不能为空';
                return;
            }
            let reg = /^1[3,4,5,6,7,8,9]\d{9}$/;
            if(!reg.test(this.account)){
                this.errMsg = '手机号码格式不正确';
                return;
            }
            if(this.password.length <= 0){
                this.errMsg = '登录密码不能为空';
                return;
            }
            this.errMsg = '';
            let that = this;
            this.loading = true;
            this.http.post( "/UserInfo/Login",{account:this.account,password:this.password})
            .then(res=>{
                this.loading = false;
                if(res.statusCode != 200){
                    this.errMsg = res.message;
                } else {
                    that.http.setToken(res.result);
                    
                    that.$message({
                        message:"登录成功",
                        type: "success",
                        duration: 600
                    });

                    setTimeout(() => {                        
                        // 执行路由跳转
                        this.$router.push({name:'homeLink'});
                    }, 600);
                }
            })
            .catch(err => {    
                this.loading = false;
                this.errMsg = "网络错误";
            });
        }
    }
}
</script>


<style scoped>
    #login{
        background-color: #ddd;
        height: 100%;
        width: 100%;
    }
    .login-form{
        position: absolute;
        top:20%;
        left: 7.5%;
        background-color: cadetblue;
        width: 85%;
        height: 320px;
        border-radius: 5px;
        padding: 20px 0 0 0;
        font-size: 20px;
    }
    .login-form>h3{
        color: white;
        font-weight: bold;
        margin-top: 0;
    }
    .login-input{        
        width:80%;
        margin: 10px auto;
        height: 40px;
        border: none;
        font-size: 16px;
    }
    .login-button{        
        font-size: 18px;
        font-weight: bold;     
        width:80%;
        margin: 10px auto;
        height: 40px;
    }
    .login-form>p{
        color:blueviolet;
        font-size: 14px;
        font-weight: normal;
        color: rgb(214, 19, 19);
        padding-bottom: 5px;
    }
    .login-form>i{
        display: block;
        margin-bottom: 10px;
        font-size: 16px;
    }
    .login-form>i:nth-last-child(2){
        color: brown;
    }
    .login-form>i:nth-last-child(1){
        color: white;
    }
    
    .footer{
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        text-align: center;
    }
</style>