/*
 * @Author: csg
 * @Date: 2023/4/12 13:23
 * @Description: Description
 */

// 微信消息自动回复
const {parseString} = require("xml2js");
const msg = require("./toXmlMsg");
var path = require("path");
const fs = require("fs");
const util = require("util");
const {
    GetCurrentTimeStr,
    requestGet,
    uploadFile,
    sendMsg,
    getAccessToken,
    materialList,
    getUserInfomation
} = require("./tools")
const {kfc4, chp, pyq, checkWord} = require("../../Api");
const {resetUserFn, checkFellow, userList, cancelList} = require("./tools");
const autoReply = function (req, res,) {
    var buffer = [];
    req.on('data', function (data) {
        buffer.push(data);
    });
    req.on('end', function () {
        //buffer转化成字符串，concat拼接方法，buffer.toString转化方法
        var msgXml = Buffer.concat(buffer).toString('utf-8');
        parseString(msgXml, {explicitArray: false}, function (err, data) {
            // 如果有错误直接抛出
            if (err) throw err;
            var result = data.xml;
            var toUser = result.ToUserName;
            var fromUser = result.FromUserName;

            // 判断消息类型
            /* if(result.MsgType === "event") {
                 eventTodo(req,res,result,fromUser,toUser)
             }
             if(result.MsgType === "text") {
                textTodo(req,res,result,fromUser,toUser)
             }
             if(result.MsgType === "voice"){
                 voiceTodo(req,res,result,fromUser,toUser)
             }
             if(result.MsgType === "image"){
                 imageTodo(req,res,result,fromUser,toUser)
             }*/
            eval(result.MsgType + "Todo")(req, res, result, fromUser, toUser)

        })
    })
}

function eventTodo(req, res, result, fromUser, toUser) {
    const appConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/appConfig.json"), "utf-8"));
    // 关注微信公众号
    if (result.Event === "subscribe") {
        userList(result.FromUserName, 1)
        var resultXml = msg.textMsg(fromUser, toUser, appConfig.welcomeText);
        res.send(resultXml);
    } else if (result.Event === "unsubscribe") {
        cancelList(result.FromUserName)
        res.end();
    } else if (result.Event === "CLICK") {
        switch (result.EventKey) {
            case "V1001_lingqu":
                var contentArr = [
                    {
                        "title": "资源列表大合集、持续更新中～",
                        "description": "资源列表大合集、持续更新中～",
                        "id": "13",
                        "picUrl": "https://mmbiz.qpic.cn/sz_mmbiz_png/cryicTSAU5sI0buJKJkN9ibxfvCXsE0nk1cwjEqbzDfcRHOdibD34S2F9fozDa8cb9eSUGcTRnc3lNrWwyqddYYyw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1",
                        "url": "https://mp.weixin.qq.com/s?__biz=Mzg3ODE3NDA4Nw==&mid=2247486882&idx=4&sn=d25e055143ad1fe1a7f3bea7312fed79&chksm=cf16874af8610e5c4c71689a966f4be0a642eb28957a822e7102eac81d3ce85258e1afb10e42&token=1947827597&lang=zh_CN#rd"
                    }
                ];
                resultXml = msg.graphicMsg(fromUser, toUser, contentArr);
                res.send(resultXml);
                break;
            case "V1001_call":
                resultXml = msg.textMsg(fromUser, toUser, "加v「BigGang-」");
                res.send(resultXml);
                break;
            case "V1001_GOOD":
                var urlPath = path.join(__dirname, "../../data/images/zan.png");
                // 上传图片uploadFile(urlPath 路径, "image" 类型) then异步函数，当前面的函数获取到数据在执行
                uploadFile(urlPath, "image").then(function ({media_id}) {
                    resultXml = msg.imgMsg(fromUser, toUser, media_id);
                    res.send(resultXml);
                })
                break;
        }
    }
}

async function textTodo(req, res, result, fromUser, toUser) {
    var resultXml = "";
    try {
        const appConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/appConfig.json"), "utf-8"));
        const Content = result.Content.toLocaleLowerCase().trim().replace(/\s/g, "");
        console.log(Content)

        // 取消过关注做限制
        var cancelItem = await checkFellow(fromUser);
        if (cancelItem && !cancelItem.cancel) {
            let count = appConfig.maxCancelCount || 2;
            let sorryText = appConfig.sorryText || "sorry";
            if (cancelItem.count <= count) {
                if (Content === sorryText) {
                    resetUserFn(fromUser)
                    resultXml = msg.textMsg(fromUser, toUser, `已解除限制！`);
                    res.send(resultXml);
                    return
                }
                resultXml = msg.textMsg(fromUser, toUser, `您于${cancelItem.lastTime || cancelItem.time} 取消关注！请发送" 「${sorryText}」"进行解除限制 `);
                res.send(resultXml);
                return
            } else {
                resultXml = msg.textMsg(fromUser, toUser, `您最终于${cancelItem.lastTime || cancelItem.time}取消关注！ 取消次数大于${count}次，将限制您获取资源，请添加管理员微信  ${appConfig.weixin}  进行解除！id:${cancelItem.name}`);
                res.send(resultXml);
                return
            }
        }
        // 自动回复
        switch (Content) {
            case '你好':
                resultXml = msg.textMsg(fromUser, toUser, "你好呀，我们又见面了！!");
                res.send(resultXml);
                break;
            case '打赏':
                var urlPath = path.join(__dirname, "../../data/images/zan.png");
                // 上传图片uploadFile(urlPath 路径, "image" 类型) then异步函数，当前面的函数获取到数据在执行
                uploadFile(urlPath, "image").then(function ({media_id}) {
                    resultXml = msg.imgMsg(fromUser, toUser, media_id);
                    res.send(resultXml);
                })
                break;
            case "1":
                var a = await getUserInfomation(fromUser)
                console.log(a)
                resultXml = msg.textMsg(fromUser, toUser, a.nickname);
                break
            case "kfc":
                var kfc = await kfc4()
                resultXml = msg.textMsg(fromUser, toUser, kfc.data.text);
                res.send(resultXml);
                break;
            case "朋友圈":
                var pyqs = await pyq()
                resultXml = msg.textMsg(fromUser, toUser, pyqs.data.text);
                res.send(resultXml);
                break;
            case "情话":
                var chps = await chp()
                resultXml = msg.textMsg(fromUser, toUser, chps.data.text);
                res.send(resultXml);
                break;
            default:
                let list = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/wxReply.json"))) || []
                console.log(list.length)
                var items = list.filter(i => Content.includes(i.name.toLocaleLowerCase()) || i.alias.includes(Content))
                if (items.length) { //存在关键字
                    let type = items[0].type
                    let item = items[0]
                    console.log(type)
                    // 图文链接
                    if (type === "link") {
                        var contentArr = item.contentArr || [];
                        resultXml = msg.graphicMsg(fromUser, toUser, contentArr);
                    } else if (type === "text") { //文本
                        resultXml = msg.textMsg(fromUser, toUser, item.content+appConfig.commonUsed);
                    } else if (type === "img") {//图片
                        var urlPath = path.join(__dirname, `../../data/images/${item.content || '1.png'}`);
                        const {media_id} = await uploadFile(urlPath, "image")
                        resultXml = msg.imgMsg(fromUser, toUser, media_id);
                    } else {
                        resultXml = msg.textMsg(fromUser, toUser, item[0].content + appConfig.commonUsed);
                    }
                } else {
                    //没有查到关键字
                    let replyText = appConfig.errorText + appConfig.commonUsed + appConfig.defaultText + appConfig.contact + appConfig.weixin + appConfig.remark
                    resultXml = msg.textMsg(fromUser, toUser, replyText);
                }
                res.send(resultXml);
        }
    } catch (e) {
        console.log(e)
        resultXml = msg.textMsg(fromUser, toUser, '服务内部出错请联系管理员！');
        res.send(resultXml);
    }
}

function voiceTodo(req, res, result, fromUser, toUser) {
    var resultXml = msg.textMsg(fromUser, toUser, result.Recognition);
    res.send(resultXml);
}

function imageTodo(req, res, result, fromUser, toUser) {
    var urlPath = path.join(__dirname, "../../../data/images/weixin.jpg");
    // 上传图片uploadFile(urlPath 路径, "image" 类型) then异步函数，当前面的函数获取到数据在执行
    uploadFile(urlPath, "image").then(function ({media_id}) {
        var resultXml = msg.imgMsg(fromUser, toUser, media_id);
        res.send(resultXml);
    })
}


module.exports = autoReply
