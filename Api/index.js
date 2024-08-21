/*
 * @Author: csg
 * @Date: 2023/4/20 09:21
 * @Description: Description
 */
const request = require("request");
//肯德基
exports.kfc4 = function () {
    return new Promise((res, rej) => {
        request("https://api.shadiao.pro/kfc", (err, response, body) => {
            if (!err) res(JSON.parse(body))
            if (err) rej(err)
        })
    })
}
//英雄战力
exports.hero = function (type, name) {
    return new Promise((res, rej) => {
        request.post('http://tool.cupmf.com/hero/detail.php', {form: {type, name}}, (err, response, body) => {
            if (!err) res(JSON.parse(body))
        })
    })
}
//彩虹屁文案
exports.chp = function () {
    return new Promise((res, rej) => {
        request("https://api.shadiao.pro/chp", (err, response, body) => {
            if (!err) res(JSON.parse(body))
            if (err) rej(err)
        })
    })
}
//朋友圈文案
exports.pyq = function () {
    return new Promise((res, rej) => {
        request("https://api.shadiao.pro/pyq", (err, response, body) => {
            if (!err) res(JSON.parse(body))
            if (err) rej(err)
        })
    })
}

//
//https://tool.cupmf.com/short/apitype.php

//  {"type":"dwzmk","domain":"dwz.mk","weight":12},{"type":"zdwz","domain":"z.dwz.mk","weight":8},
//  {"type":"wxurl","domain":"wxurl.me","weight":8},{"type":"u5kcn","domain":"u5k.cn","weight":3},
//  {"type":"suoim","domain":"suo.im","weight":1},{"type":"m6zcn","domain":"m6z.cn","weight":1},
//  {"type":"suonz","domain":"suo.nz","weight":1},{"type":"syam","domain":"s.yam.com","weight":1},
//  {"type":"dyam","domain":"g.yam.com","weight":1},{"type":"u6vcn","domain":"u6v.cn","weight":1},
//  {"type":"aadtw","domain":"aad.tw","weight":1}]
//https://tool.cupmf.com/short/api.php
//短网址生成
exports.shortApi = function (content, urlType = "dwzmk") {
    return new Promise((res, rej) => {
        request.post('https://tool.cupmf.com/short/api.php', {form: {urlType, content}}, (err, response, body) => {
            if (!err) res(JSON.parse(body))
            if (err) rej(err)
        })
    })
}


//斗图
exports.doutu = function (keyword) {
    return new Promise((res, rej) => {
        request.post('https://tool.cupmf.com/doutu/api.php', {form: {keyword}}, (err, response, body) => {
            if (!err) res(JSON.parse(body))
            if (err) rej(err)
        })
    })
}

//违禁词检测
exports.checkWord = function (content) {
    return new Promise((res, rej) => {
        request.post('https://tool.cupmf.com/check/check.php', {form: {content}}, (err, response, body) => {
            if (!err) res((body))
            if (err) rej(err)
        })
    })
}


 //https://v1.hitokoto.cn/
//360壁纸
exports.WallPaper = function () {
    return new Promise((res, rej) => {
        request("https://www.png.cool/360/index.php?c=WallPaper&a=getAppsByCategory&cid=36&start=48&count=24&from=360chrome", (err, response, body)=>{
            if (!err) res(JSON.parse(body))
            if (err) rej(err)
        })
    })
}

