/*
 * @Author: csg
 * @Date: 2023/4/12 17:24
 * @Description: Description
 */
const util = require("util");
const path = require("path");

const fs = require("fs");
const wechatApi = require("../../Api/wechat");
const {requestPost, requestGet, requestPostForm, GetCurrentTimeStr} = require("../../utils");
const that =this;
/**
 * 获取当前时间字符串
 * @returns {string}
 * @constructor
 */
exports.GetCurrentTimeStr=function () {
    var currentDate = new Date();
    var year = currentDate.getFullYear().toString();
    var month = (currentDate.getMonth() + 1).toString();
    if (month.length === 1){
        month = "0" + month;
    }
    var date = currentDate.getDate().toString();
    if (date.length === 1){
        date = "0" + date;
    }
    var hour = currentDate.getHours().toString();
    if (hour.length === 1){
        hour = "0" + hour;
    }
    var minute = currentDate.getMinutes().toString();
    if (minute.length === 1){
        minute = "0" + minute;
    }
    var second = currentDate.getSeconds().toString();
    if (second.length === 1){
        second = "0" + second;
    }
    return year+"-"+month+"-"+date+" " + hour+":"+minute+":"+second;
}

exports.sendMsg = function ({content="你好",userId="oSV-p5mrJb9dJOP8kVUfSjBdQiPw",type='text',media_id=""},index=0) {
    return new Promise(function(resolve, reject) {
        that.getAccessToken(index).then(function(data){
            let json = {};
            if(!userId){
                resolve({
                    message:"请输入userId",
                    success:false
                })
            }
            switch (type) {
                case "text":
                    json={
                        "touser":userId,
                        "msgtype":type,
                        "text":
                            {
                                "content":content
                            }
                    };
                    break;
                case "voice":
                    json={
                        "touser":userId,
                        "msgtype":"voice",
                        "voice":
                            {
                                "media_id":media_id
                            }
                    }
                    break;
                case "image":
                    json={
                        "touser":userId,
                        "msgtype":"image",
                        "image":
                            {
                                "media_id":media_id
                            }
                    }
                    break;
                case "news":
                    json={
                        "touser":"OPENID",
                        "msgtype":"news",
                        "news":{
                            "articles": [
                                {
                                    "title":"Happy Day",
                                    "description":"Is Really A Happy Day",
                                    "url":"URL",
                                    "picurl":"PIC_URL"
                                }
                            ]
                        }
                    }
                    break;
                default:
                    json={
                        "touser":userId,
                        "msgtype":"text",
                        "text":
                            {
                                "content":content
                            }
                    };
            }
            var url =  wechatApi.sendMsg(data.access_token);
            requestPost(url, json).then(function(result) {
                resolve({
                    data:(result),
                    success:true
                });
            })
        })
    })
}

exports.getAccessToken =function() {
    return new Promise(function(resolve,reject){
        var currentTime = new Date().getTime();
        var url =wechatApi.getAccessToken()

        //判断本地存储的 access_token 是否有效
        const accessTokenJson = JSON.parse(fs.readFileSync(path.join(__dirname, './access_token.json')).toString());

        if(!accessTokenJson||!accessTokenJson.access_token || accessTokenJson.expires_time < currentTime){
            console.log(url,"getAccessTokenUrl")
            requestGet(url).then(function(data){
                var result = JSON.parse(data);
                console.log(result,"getAccessToken")
                if(data.indexOf("errcode") < 0){
                    accessTokenJson.access_token = result.access_token;
                    accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                    //更新本地存储的
                    fs.writeFile(path.join(__dirname, './access_token.json'),JSON.stringify(accessTokenJson), ()=>{
                        console.log('写入成功---',"access_token")
                    });
                    resolve(accessTokenJson.access_token);
                }else{
                    resolve(result);
                }
            });
        }else{
            //将本地存储的 access_token 返回
            resolve(accessTokenJson.access_token);
        }
    });
}


// 素材上传
exports.uploadFile = function(urlPath, type) {
    return new Promise(function(resolve, reject) {
        that.getAccessToken().then(function(token){
            var form = { //构造表单
                media: fs.createReadStream(urlPath)
            }
            var url = wechatApi.uploadFile(token,type)
            requestPostForm(url, form).then(function(result) {
                resolve(JSON.parse(result));
            })
        })
    })
}
//设置菜单
exports.setMenu=function () {
    that.getAccessToken().then(function(token){
        var url =wechatApi.createMenu(token)
        var Data = JSON.parse(fs.readFileSync(path.join(__dirname,'../../data/menu.json')))
        requestPost(url,Data).then(function(data){
            //将结果打印
            if(data.errcode==0){
                console.log(data,"菜单设置成功");
            }else {
                console.log(data,"菜单设置失败");
            }
        });
    });
}

//获取素材列表
exports.materialList = function (type = "news", count = 10, offset = 0) {
    return new Promise(function (resolve, reject) {
        that.getAccessToken().then(function (token) {
            let url = wechatApi.materialList(token);
            requestPost(url, {
                "type": type,
                "offset": offset,
                "count": count
            }).then(function (data){
                resolve(JSON.parse(data));
            }).catch(function (err) {
                reject(err);
            })
        })
    })
}


// 获取用户信息
exports.getUserInfomation = function (openid) {
    return new Promise(function (resolve, reject) {
        that.getAccessToken().then(function (access_token) {
            var url = wechatApi.getUserInfomation(access_token, openid);
            requestGet(url).then(function (result) {
                resolve(JSON.parse(result));
            })
        })
    })
}

//重置
exports.resetUserFn=(name) =>{
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/cancelList.json")).toString())
    data.forEach(i => {
        if (i.name === name) {
            i.count--;
            i.cancel = true;
        }
    })
    fs.writeFileSync(path.join(__dirname, "../../data/cancelList.json"), JSON.stringify(data, null, '\t'))
}
//取消列表
exports.cancelList=(name)=> {
    fs.readFile(path.join(__dirname, "../../data/cancelList.json"), (err, data) => {
        if (!err) {
            let list = JSON.parse(data.toString())
            let item = list.filter(i => i.name === name)?.[0]
            if (item) {
                try {
                    item.count++
                } catch (e) {
                    item.count = 1;
                }
                item.lastTime = GetCurrentTimeStr();
                item.cancel = false;
            } else {
                list.push({
                    name,
                    time: GetCurrentTimeStr(),
                    cancel: false,
                    count: 1
                })
            }
            fs.writeFileSync(path.join(__dirname, "../../data/cancelList.json"), JSON.stringify(list, null, '\t'))
        } else {
            console.log(err)
        }
    })
}
//判断是否取关过
 exports.checkFellow=async (from)=> {

    let data = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/cancelList.json")).toString())

    return data.filter(i => i.name === from)?.[0];
}

//用户列表存到userList.json
exports.userList = (name, type)=> {
    fs.readFile(path.join(__dirname, "../../data/userList.json"), (err, data) => {
        if (!err) {
            let list = JSON.parse(data.toString())
            let item = list.filter(i => i.name === name)?.[0]
            if (item) {
                try {
                    item.count++
                } catch (e) {
                    item.count = 0;
                }
                item.lastTime = GetCurrentTimeStr();
            } else {
                list.push({
                    name,
                    time: GetCurrentTimeStr()
                })
            }
            fs.writeFileSync(path.join(__dirname, "../../data/userList.json"), JSON.stringify(list, null, '\t'))
        } else {
            console.log(err)
        }
    })
}

