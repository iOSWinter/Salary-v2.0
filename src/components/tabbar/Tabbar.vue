<template>
    <div id="tabbar">
        <div>
            <router-link :class="{selected : summarySelected}" to="/summary">
                <img src="../../assets/summary.png">
                <p>{{summaryTitle}}</p>
            </router-link>
        </div>
        <div>
            <router-link class="unnormal" v-show="homeShow" :class="{selected : homeSelected}" to="/addSalary">
                <img src="../../assets/add.png">
                <p>{{addTitle}}</p>
            </router-link>
            <router-link v-show="!homeShow" :class="{selected : homeSelected}" to="/home?add=true">
                <img src="../../assets/home.png">
                <p>{{homeTitle}}</p>
            </router-link>
        </div>
        <div>
            <router-link :class="{selected : mineSelected}" to="/mine">
                <img src="../../assets/mine.png">
                <p>{{mineTitle}}</p>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            summaryTitle:'汇总',
            homeTitle:'主页',
            addTitle:'添加',
            mineTitle:'我的'
        }
    },
    props:{
        homeShow:{
            type:Boolean,
            default:false
        },
        summarySelected:{
            type:Boolean,
            default:false
        },
        homeSelected:{
            type:Boolean,
            default:false
        },
        mineSelected:{
            type:Boolean,
            default:false
        },
    }
}
</script>

<style scoped>
    #tabbar{
        width: 100%;
        height: 50px;
        background-color: white;
        position: fixed;
        left: 0;
        bottom: 0;
        border-top: 1px solid #ccc;
    }
    #tabbar>div{
        width:calc(100% / 3);
        float: left;
        /* font-size: 16px; */
        margin: 5px auto;
    }
    #tabbar>div>a{
        display: block;
        width: 100%;
        height: 100%;
        color: #555;
    }
    #tabbar>div>a>i{
        font-size: 20px;
    }
    #tabbar>div>a.unnormal>i:nth-child(1){
        font-size: 30px; 
        margin-top:5px;
    }

    #tabbar>div img{
        width: 20px;
        height: 20px;
    }
    #tabbar>div p{
        margin: 0;
    }

    #tabbar>div>.selected{
        color: green;
        font-weight: bold;
    }
    a{
        text-decoration: none;
    }
</style>
