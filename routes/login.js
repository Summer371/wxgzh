/*
 * @Author: csg
 * @Date: 2023/6/12 16:21
 * @Description: Description
 */
const router = require("express").Router();

const {enToken, getCaptcha, responseJson, responseJsonErr} =require("../utils");
const fs = require("fs");
const path = require("path");
const {request} = require("express");

router.post("/login",(req, res)=>{
    let { username, password, code} =req.body;
    let adminList = JSON.parse(fs.readFileSync(path.resolve(__dirname,"../data/admin.json")).toString()) || [];
    if(adminList.filter(i=>i.username ===username && i.password===password).length){
        res.json(responseJson(200,{
            token:enToken(username),
            userInfo:{
                username
            }
        }, "登录成功！"))
    }else {
        res.json(responseJsonErr(null,"登录失败！"))
    }

})
router.post("/loginWx", async (req, res) => {
    var {js_code, name, avatarUrl} = req.body;
    try {
        let wx = await request({url: `https://api.weixin.qq.com/sns/jscode2session?appid=${global.appid}&secret=${global.secret}&js_code=${js_code}&grant_type=authorization_code`})
        let username = wx.data.openid;
        let userList = JSON.parse(fs.readFileSync(path.resolve(__dirname,"../data/users.json")).toString()) || [];
        let item = userList.filter(i=>i.username ===username)
        if(item.length){
            res.json(responseJson(200, {
                token: enToken(username),
                userInfo:item[0]
            }, "登录成功！"))
        }else {
            let data = {
                username,
                name,
                avatarUrl,
                time: new Date().getTime()
            }
            userList.push(data)
            fs.writeFileSync(path.resolve(__dirname,"../data/users.json"),JSON.stringify(userList,null,"\t"))
            res.json(responseJson(200, {
                token: enToken(username),
                userInfo: data
            }, "登录成功！"))
        }


    } catch (error) {
        res.json(responseJsonErr(error, "登录失败！"))
    }


})
router.get("/code",(req,res)=>{
    const captcha = getCaptcha();
    //保存到cookie,忽略大小写
    res.cookie('captcha',captcha.text.toLowerCase())
    //res.type('svg')
    //res.json(responseJson(200,captcha.data,))
    res.json(responseJson(200,"http://dummyimage.com/100x40/dcdfe6/000000.png&text="+captcha.text))
})
module.exports = router;
