<template>
    <div id="mine" v-loading="loading">
        <div class="all">
            <div class="top">
                <div class="left">
                    <img :src="headUrl">
                </div>
                <div class="right">
                    <p>{{nick}}</p>
                    <p>{{account}}</p>
                    <p>{{registerTime}}</p>
                </div>
            </div>
            <div class="option">
                <div>
                    <p>{{recordMonthTitle}}</p>
                    <p>{{recordMonth}}</p>
                </div>
                <div @click="checkMineScore">
                    <p>{{mineScoreTitle}}</p>
                    <p>{{mineScore}}</p>
                </div>
                <div @click="setRatio">
                    <p>{{ratioTitle}}</p>
                    <i class="fa fa-arrow-circle-o-right"></i>
                </div>
                <div @click="checkHelp">
                    <p>{{help}}</p>
                    <i class="fa fa-arrow-circle-o-right"></i>
                </div>
                <div v-if='admin' @click="adminClick">
                    <p>{{adminTitle}}</p>
                    <i class="fa fa-user-o"></i>
                </div>
            </div>

            <!-- 我的积分 -->
            <el-dialog @close="scoreDialogVisible = false" title="我的积分" :visible="scoreDialogVisible" width=70% :show-close="false">
                <div class="score-area">
                    <el-table :data="scoreData" size="small">
                        <el-table-column label="时间" property="time" align="center" width="120"></el-table-column>
                        <el-table-column label="积分值" property="score" align="right"></el-table-column>
                    </el-table>
                </div>
            </el-dialog> 
            
            <!-- 使用帮助 -->
            <el-dialog @close="helpDialogVisible = false" title="使用帮助" :visible="helpDialogVisible" width=70% :show-close="false">
                <div class="help-area">
                    <el-collapse v-model="activeName" accordion>
                        <el-collapse-item title="关于职业历程" name="1">
                          <div>职业历程是一款定位于服务职场人士便于管理自身职业发展历程的应用，记录职业生涯中的各类薪资福利，整理汇总职业发展历程数据，为用户提供终身免费使用和数据安全加密的体验。</div>
                        </el-collapse-item>
                        <el-collapse-item title="关于注册登录" name="2">
                          <div>用户可通过本应用进行账号注册，注册账号只能是手机号码，并通过输入验证码进行登录；登录已注册的账号只能通过账号和密码组合进行，若注册后首次登录本应用时没有及时设置密码或遗忘密码，可通过登录页面的忘记密码进行密码设置或找回。</div>
                        </el-collapse-item>
                        <el-collapse-item title="关于个人信息" name="3">
                          <div>用户登录成功后，可点击我的页面右上角设置图标，进入编辑个人资料页面即可填写个人相关资料，提交后可额外获得应用积分奖励。</div>
                        </el-collapse-item>
                        <el-collapse-item title="关于更换手机号" name="4">
                          <div>用户可通过进入编辑个人资料页面，选择账号管理进行手机号更换操作。</div>
                        </el-collapse-item>
                        <el-collapse-item title="关于积分" name="5">
                            <div>【积分获得】用户添加记录即可获得对应的积分，每条记录可获得2个积分，一个月内至多拥有5次获得积分的机会；若删除获得积分的记录将一同删除所获得的积分，删除后获得积分的机会将增加对应的次数；用户可通过我的页面—我的记录，点击即可查看积分获取记录。</div>
                            <div>【积分使用】积分使用目前暂时无法提供，我们会尽快开发完善相应功能。</div>
                        </el-collapse-item>
                        <el-collapse-item title="关于添加记录" name="6">
                            <div>【基本说明】用户可在主页进行记录添加操作，其中基本薪资、加项、减项、奖金均为税前金额，餐费为税后金额，添加时需略加注意。</div>
                            <div>【五险一金】社保、公积金等缴费基数均按照月基本薪资计算，若与实际不符，可单独进行设置。</div>
                            <div>【缴费比例】社保、公积金等缴费比例可通过配置缴费比例进行设置，未设置将以0.00%计算。</div>
                        </el-collapse-item>
                        <el-collapse-item title="关于查看记录" name="7">
                          <div>添加的记录可以在主页列表进行查看，若条目较多可通过点击加载更多查看更多历史记录；单击条目可查看对应月份的薪资记录详情信息，亦可通过详情页的删除图标进行记录编辑和删减，另外单击详情页以外区域可关闭详情查看页。</div>
                        </el-collapse-item>
                        <el-collapse-item title="关于问题反馈" name="8">
                            <div>若您在使用过程中遇到如何困难或不便，请将您的疑虑反馈给我们，联系方式如下：</div>
                            <div>邮箱：lequnet@163.com</div>
                            <div>微信：关注公众号：LQNet2018，进行留言。</div>
                        </el-collapse-item>
                      </el-collapse>
                </div>
            </el-dialog> 
        </div>

        <div class="logout" @click="logout">{{logoutTitle}}</div>

        <tabbar :homeShow="false" :mineSelected="true"></tabbar>
    </div>
</template>

<script>
import Tabbar from '../tabbar/Tabbar'
import Help from './Help'

export default {
    components:{
        Tabbar
    },
    data(){
        return {
            headUrl:'',
            nick:'昵称',
            account:'登录账号',
            registerTime:'注册时间未知',
            recordMonthTitle:'记录月数',
            recordMonth:0,
            mineScoreTitle:'我的积分',
            mineScore:0,
            ratioTitle:'设置缴费比例',
            help:'使用帮助',
            logoutTitle:'退出登录',
            adminTitle:'系统管理',
            admin:false,
            loading:false,
            scoreDialogVisible:false,
            scoreData: [],
            helpDialogVisible:false,
            helpData: [],
        }
    },
    methods:{
        setRatio(){
            this.$router.push({name:'ratioLink'});
        },
        logout(){
                this.$message({
                    message:"退出登录成功",
                    type:"success",
                    duration:1000               
                });
                setTimeout(()=>{
                    this.http.setToken('');
                    this.$router.replace({name : 'loginLink'});
                }, 1000);
        },

        checkMineScore(){
            this.loading = true;
            this.http.post("/Mine/GetMineSocre")
            .then(res => {
                this.loading = false;
                if (res.statusCode == 200) {
                     this.generateMineScoreHtml(res.result);
                }else{
                    this.$message({
                        message:res.message,
                        type:"warning",
                        duration:600
                    });
                }
            })
            .catch(err => {
                this.loading = false;
                this.$message({
                    message:"网络错误",
                    type:"error",
                    duration:600
                });
            })
        },

        checkHelp(){

            this.helpDialogVisible = true;
            // this.loading = true;
            // this.http.post("/Mine/GetUseHelp")
            // .then(res => {
            //     this.loading = false;
            //     if (res.statusCode == 200) {
            //         this.generateHelpHtml(res.result);
            //     }else{
            //         this.$message({
            //             message:res.message,
            //             type:"warning",
            //             duration:600
            //         });
            //     }
            // })
            // .catch(err => {
            //     this.loading = false;
            //     this.$message({
            //         message:"网络错误",
            //         type:"error",
            //         duration:600
            //     });
            // })
        },
        adminClick(){
            if(this.admin){
                this.$message({
                    message:'鉴权通过',
                    type:"success",
                    duration:600                
                });
                setTimeout(()=>{                    
                    this.$router.push({name:'adminLink'})
                }, 600);
            }else{
                this.$message({
                    message:'鉴权未通过',
                    type:"warning",
                    duration:600                
                });
            }
        },

        generateMineScoreHtml(jsonData){
            let scoreData = [];
            for (let i = 0; i < jsonData.length; i++){
                let json = jsonData[i];
                var time = new Date(json.time);
                scoreData.push({score:json.score, time:`${time.getFullYear()}-${((time.getMonth() + 1) < 10 ? "0" : "") + (time.getMonth() + 1)}-${(time.getDate() < 10 ? "0" : "") + time.getDate()} ${(time.getHours() < 10 ? "0" : "") + time.getHours()}:${(time.getMinutes() < 10 ? "0" : "") + time.getMinutes()}`});
            }
            this.scoreData = scoreData;
            this.scoreDialogVisible = true;
        },
    },

    created(){
        this.http.post("/Mine/GetPersonalInfo")
        .then(res => {
            this.nick = res.result.nick;
            this.account = res.result.account;
            this.registerTime = res.result.registerTime;
            this.headUrl = `${'http://www.lequwangluo.cn'}${res.result.headUrl}`.toLocaleLowerCase();
            this.recordMonth = res.result.monthCount;
            this.mineScore = res.result.totalScore;
            this.admin = (this.account == '17882928696');
        })
        .catch(err => {
            layer.msg('网络错误', {time:500});
        })
    }
}
</script>


<style scoped>
    *{
        margin: 0;
        padding: 0;
    }
    #mine{
        background-color: white;
        height: 100%;
        width: 100%;
    }
    #mine>.all{
        padding-bottom: 100px;
    }
    .top{
        height: 130px;
        background-color: antiquewhite;
    }
    .left{
        width:100px;
        height: 100px;
        padding: 10px;
        padding-top: 20px;
    }
    .left>img{
        display: block;
        width:80px;
        height: 80px;
        border-radius: 40px;
        border: 1px solid #ccc;
    }
    .top>div{
        float: left;
    }
    .top>div:nth-last-child(1){
        padding-top: 20px;
        padding-left: 10px;
    }
    .top>div:nth-last-child(1)>p{
        margin: 5px auto;
        text-align: left;
        color: coral;
        font-size: 16px;
    }

    .option{
        color: darkblue;
        font-size: 16px;
        padding-left: 10px;
    }
    .option>div{
        border-bottom: 1px solid #ccc;
        height: 50px;
    }
    .option>div>p:nth-child(1){
        float: left;
        width: calc(100% - 100px);
        text-align: left;
        line-height: 50px;
    }
    .option>div>i,.option>div>p:nth-last-child(1){
        float: left;
        width: 70px;
        text-align: right;
        padding-right: 10px;
        line-height: 50px;
    }
    .score-area{
        height: 400px;
        overflow: auto;
    }
    .help-area{
        height: 400px;
        overflow: scroll;
        text-align: left;
    }

    .logout{
        background-color: crimson;
        color : white;
        font-size: 18px;
        font-weight: bold;
        height: 40px;
        line-height: 40px;
        position: fixed;
        left: 0;
        bottom: 51px;
        width:100%;
    }
</style>