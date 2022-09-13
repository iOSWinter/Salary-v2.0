import axios from 'axios'
import vue_extend from '../vue_extend/extendMethod'

axios.defaults.baseURL = 'http://lequwangluo.cn/api/'
axios.defaults.timeout = 60 * 1000
axios.defaults.headers = {
    "Content-Type":"application/json"
}
axios.interceptors.response.use(config => {
    return config.data;
})

let loginLink = '/login'
let token = localStorage.getItem('SalaryUserToken')
let id = localStorage.getItem('SalaryUserId')

export default {

    // 网络请求 post 方式
    post(action, params){
        this.judgeLoginStatus(action);
        if(params == null || params == undefined){
            params = {data:{id:id,token:token}};
        } else {
            if(params.data){
                params.data.token = token;
                params.data.id = id;
            }
            else{
                params.data = {id:id,token:token};
            }
        }

        return new Promise((resolve, reject) => {

            axios.post(action, JSON.stringify(params))
            .then(res => {
                if(res.Entity){
                    let entityRes = capitalToLower(res.Entity);
                    if(entityRes.statusCode == 401){
                        this.setToken(';');
                        location.href = loginLink;
                    } else {
                        resolve(entityRes);
                    }
                } else {
                    reject("网络错误");
                }
            })
            .catch(err => {
                reject(err);
            })
        })
    },

    judgeLoginStatus(action){

        if(action == '/UserInfo/Login'){
            return;
        }
        if(token == null || token == undefined || token.length != 36){
            location.href = loginLink;
        }
    },

    setToken(newToken){
        let userInfos = newToken.split(';');
        id = userInfos[0];
        token = userInfos[1];
        localStorage.setItem("SalaryUserId",id);
        localStorage.setItem("SalaryUserToken",token);
    },
}

function capitalToLower(json) {
    if (!json) {
        return json;
    }
    let returnObj = {};
    if (Array.isArray(json)) {
        // 是数组
        returnObj = [];
        for (let value of vue_extend.values(json)) {
            if (typeof value == 'object') {

                returnObj.push(capitalToLower(value));
            } else {
                returnObj.push(value);
            }
        }
    } else {
        // 是对象
        for (let [key, value] of vue_extend.entries(json)) {
            // if (key.toLowerCase() == "id") {
            //     continue;
            // }
            // console.log(key, value)
            let newKey = `${key.substring(0, 1).toLowerCase()}${key.substring(1, key.length)}`;
            if (typeof value == 'object' && value != null) {
                value = capitalToLower(value);
            }
            returnObj[newKey] = convertTimeFormat(value);
        }
    }
    return returnObj;
}

function convertTimeFormat(time) {
    var reg = /(^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.)*\d*)[Z+]/;
    if (reg.test(time)) {
        let t = time.replace('T', ' ').replace(/[Z+]\S*/, '').replace(/-/g, '/').split('.')[0];
        return new Date(t);
    }
    return time;
}
