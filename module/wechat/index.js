const sha1 = require("sha1"); //引入加密模块
const path = require("path");
// 微信授权验证方法
const WeChatAuth = function(req, res) {
    // 获取微信服务器发送的数据
    const signature = req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        echostr = req.query.echostr;
    const token = process.env["TOKEN"]
    // token、timestamp、nonce三个参数进行字典序排序
    const arr = [token, timestamp, nonce].sort().join('');
    // sha1加密
    const result = sha1(arr);
    // 判断是否是微信服务器发来的请求
    if(result === signature){
        //返回公众号的echostr
        res.send(echostr);
    }else{
        // 返回网站主页页面
        res.sendFile((path.join(__dirname, "../../web/index.html")));
    }
}

// 暴露WeChat对象
module.exports = WeChatAuth;

