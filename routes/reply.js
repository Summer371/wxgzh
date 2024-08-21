/*
 * @Author: csg
 * @Date: 2023/6/9 09:39
 * @Description: Description
 */
const {responseJson, responseJsonErr, pageList, GetCurrentTimeStr, uuid} = require("../utils");
const path = require("path");
const fs = require("fs");
const router = require("express").Router();

router.get("/list", (req, res) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/data.json")).toString());
    let {currentPage = 1, size = 10, name = ''} = req.query;
    if (name) {
        data = data.filter(i => i.name.includes(name))
    }
    let list = pageList(data, currentPage, size) //data.slice((currentPage-1) * size,currentPage * size)

    res.json(responseJson(200, {list: list, total: data.length}))
})
router.get("/data", (req, res) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/data.json")).toString());
    res.json(responseJson(200, data))
})
router.post("/update", (req, res) => {
    let list = req.body;
    if (list.length) {
        fs.writeFileSync(path.resolve(__dirname, "../data/data.json"), JSON.stringify(list, null, '\t'))
    }
    res.json(responseJson(200))
})
router.post("/updateOne", (req, res) => {
    let {id, content, name, alias = '', type = "text", contentArr = [], href = '', contentHtml = ""} = req.body;
    if (!id || !content || !name) {
        res.json(responseJsonErr(null, "缺少参数！"))
        return
    }
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/data.json")).toString()) || [];
    data.forEach(i => {
        if (i.id === id) {
            i.name = name;
            i.type = type;
            i.contentArr = contentArr;
            i.content = content;
            i.alias = alias ? alias.split(",") : []
            i.updateTime = GetCurrentTimeStr();
            i.href = href;
            i.contentHtml = contentHtml;
        }
    })
    fs.writeFileSync(path.resolve(__dirname, "../data/data.json"), JSON.stringify(data, null, '\t'))
    res.json(responseJson(200))
})
router.post("/addOne", (req, res) => {
    let {content, name, alias = '', type = "text", contentArr = [], href = '', contentHtml = ''} = req.body;
    if (!content || !name) {
        res.json(responseJsonErr(null, "缺少参数！"))
        return
    }
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/data.json")).toString()) || [];
    let ishas = data.filter(i => i.name.toLocaleLowerCase() === name.toLocaleLowerCase())
    if (ishas.length) {
        res.json(responseJsonErr(null, "名称重复了"))
        return
    }
    data.push({
        name,
        content,
        type,
        contentArr,
        href,
        contentHtml,
        alias: alias ? alias.split(",") : [],
        id: uuid(),
        updateTime: GetCurrentTimeStr(),
        createTime: GetCurrentTimeStr()
    })
    fs.writeFileSync(path.resolve(__dirname, "../data/data.json"), JSON.stringify(data, null, '\t'))
    res.json(responseJson(200))
})
router.post("/deleteOne", (req, res) => {
    let {id} = req.body;
    if (!id) {
        res.json(responseJsonErr(null, "缺少参数！"))
        return
    }
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/data.json")).toString()) || [];
    data = data.filter(i => i.id !== id)
    fs.writeFileSync(path.resolve(__dirname, "../data/data.json"), JSON.stringify(data, null, '\t'))
    res.json(responseJson(200))
})
router.post("/deleteMany", (req, res) => {
    let {ids} = req.body;
    if (ids.length) {
        let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/data.json")).toString()) || [];
        data = data.filter(i => !ids.includes(i.id))
        fs.writeFileSync(path.resolve(__dirname, "../data/data.json"), JSON.stringify(data, null, '\t'))
    }
    res.json(responseJson(200))
})
router.get("/appConfig", (req, res) => {
    let {file = "appConfig.json", dir = "../data/"} = req.query;
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `${dir + file}`)).toString());
    res.json(responseJson(200, data))
})

router.post("/appConfig", (req, res) => {
    let data = req.body;
    let {file = "appConfig.json", dir = "../data/"} = req.query;
    if (Object.keys(data).length === 0) {
        res.json(responseJsonErr(null, "缺少参数！"))
        return
    }
    try {
        fs.writeFileSync(path.resolve(__dirname, `${dir + file}`), JSON.stringify(data, null, '\t'))
        res.json(responseJson(200))
    } catch (e) {
        res.json(responseJsonErr(null, e.message))
    }

})
router.get("/jsonList", (req, res) => {
    //获取目录下的所以json文件
    let {dir = "../data/", type = "json"} = req.query;
    let files = fs.readdirSync(path.resolve(__dirname, dir));
    let list = files.filter(i => i.includes(`.${type}`))
    res.json(responseJson(200, list))
})


module.exports = router;
