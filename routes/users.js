/*
 * @Author: csg
 * @Date: 2023/6/9 16:54
 * @Description: Description
 */
const {responseJson, responseJsonErr, GetCurrentTimeStr,pageList} = require("../utils");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");

//取消用户列表下载
router.get('/cancelList', function (request, response) {
    try{
        let {currentPage=1,size=10,name=''}=request.query;
        let f = JSON.parse(fs.readFileSync(path.resolve( __dirname ,"../data/cancelList.json")).toString()).sort((a,b)=>{return new Date(b.time) - new Date(a.time)})
        if(name) {
            f=f.filter(i=>i.name.includes(name))
        }
        let list = pageList(f,currentPage,size)
        response.json({code:200,data:{list,total:f.length}})
    }catch (e) {
        response.json(responseJsonErr(null))
    }
});
router.post("/cancelItem",(req,res)=>{
    try {
        let {name} = req.body;
        if( !name ){
            res.json(responseJsonErr(null,"缺少参数！"))
            return
        }
        let data = JSON.parse(fs.readFileSync(path.resolve(__dirname,"../data/cancelList.json")).toString()) || [];
        data.forEach((i,j)=>{
            if(i.name ==name) {
                i.cancel = true;
                i.count = 2
            }
        })
        fs.writeFileSync(path.resolve(__dirname,"../data/cancelList.json"),JSON.stringify(data,null,'\t'))
        res.json(responseJson(200))
    }catch (e) {
        res.json(responseJsonErr(null))
    }
})

router.get('/adminList', function (request, response) {
    const f = JSON.parse(fs.readFileSync(path.resolve( __dirname ,"../data/admin.json")).toString())
    let {currentPage=1,size=10}=request.query;
    let list = pageList(f,currentPage,size)
    response.json({code:200,data:{list,total:f.length}})
});
router.post("/addAdmin",(req,res)=>{
    let {password,username} = req.body;
    if( !password || !username){
        res.json(responseJsonErr(null,"缺少参数！"))
        return
    }
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname,"../data/admin.json")).toString()) || [];
    data.push({
        username,
        password,
        id:data.length+1,
        createTime:GetCurrentTimeStr()
    })
    fs.writeFileSync(path.resolve(__dirname,"../data/admin.json"),JSON.stringify(data,null,'\t'))
    res.json(responseJson(200))
})
router.get("/info",(req,res)=>{
    res.json(responseJson(200,{}))
})
module.exports = router;

