/*
 * @Author: csg
 * @Date: 2024/8/20 19:26
 * @Description: Description
 */

const {responseJson, responseJsonErr, GetCurrentTimeStr,pageList} = require("../utils");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");

//主链接列表
router.get('/siteLinkList', function (request, response) {
    try{
        let {currentPage=1,size=10,name=''}=request.query;
        let f = JSON.parse(fs.readFileSync(path.join( __dirname ,"../data/home/siteLinks.json")).toString())
        if(name) {
            f=f.filter(i=>i.name.includes(name))
        }
        let list = pageList(f,currentPage,size)
        response.json(responseJson(200,{list,total:f.length}))
    }catch (e) {
        console.log(e)
        response.json(responseJsonErr(null))
    }
});
//底部图标链接列表
router.get('/socialLinkList', function (request, response) {
    try{
        let {currentPage=1,size=10,name=''}=request.query;
        let f = JSON.parse(fs.readFileSync(path.join( __dirname ,"../data/home/socialLinks.json")).toString())
        if(name) {
            f=f.filter(i=>i.name.includes(name))
        }
        let list = pageList(f,currentPage,size)
        response.json(responseJson(200,{list,total:f.length}))
    }catch (e) {
        response.json(responseJsonErr(null))
    }
});
module.exports = router;

