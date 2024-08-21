/*
 * @Author: csg
 * @Date: 2023/6/9 16:59
 * @Description: Description
 */

const jwt = require("jwt-simple");
const tokenKey = process.env.TOKEN_KEY;
const request = require("request");

exports.GetCurrentTimeStr = function (currentDate = new Date()) {
    var year = currentDate.getFullYear().toString();
    var month = (currentDate.getMonth() + 1).toString();
    if (month.length === 1) {
        month = "0" + month;
    }
    var date = currentDate.getDate().toString();
    if (date.length === 1) {
        date = "0" + date;
    }
    var hour = currentDate.getHours().toString();
    if (hour.length === 1) {
        hour = "0" + hour;
    }
    var minute = currentDate.getMinutes().toString();
    if (minute.length === 1) {
        minute = "0" + minute;
    }
    var second = currentDate.getSeconds().toString();
    if (second.length === 1) {
        second = "0" + second;
    }
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

exports.responseJson = function (code = 200, data = null, msg = "success") {
    return {
        code,
        data,
        msg,
        message: msg
    }
}
exports.responseJsonErr = function (data = null, msg = "error") {
    return {
        code: 500,
        data,
        message: msg
    }
}
//验证码
exports.getCaptcha = function () {
    const svgCaptcha = require('svg-captcha')
    return svgCaptcha.create({
        inverse: false, // 翻转颜色
        fontSize: 48, // 字体大小
        noise: 2, // 干扰线条数
        width: 100, // 宽度
        height: 40, // 高度
        size: 4, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        color: true, // 验证码是否有彩色
        background: '#cccccc', // 验证码图片背景颜色
    })
}
//分页
exports.pageList = (data = [], pageNo = 1, pageSize = 10, order = "desc", orderby = "date") => {
    if (orderby) {
        data = data.sort((a, b) => {
            if (order === "desc") {
                return new Date(b[orderby]).getTime() - new Date(a[orderby]).getTime()
            } else {
                return new Date(a[orderby]).getTime() - new Date(b[orderby]).getTime()
            }
        })
    }

    if (pageNo < 1) pageNo = 1
    if (pageNo > Math.ceil(data.length / pageSize)) pageNo = Math.ceil(data.length / pageSize)


    return data.slice((pageNo - 1) * pageSize, pageNo * pageSize)
}

// 解密 token
module.exports.deToken = function (token) {
    try {
        const info = jwt.decode(token, tokenKey);
        if (info.lastTime > Date.now()) {
            if (info.lastTime - Date.now() < 2 * 1000 * 60) {
                return {
                    code: 2,
                    msg: "正常,2分钟内过期",// 续期
                    info
                }
            } else {
                return {
                    code: 1,
                    msg: "正常",
                    info
                }
            }
        } else {
            return {
                code: 3,
                msg: "toke过期"
            }
        }
    } catch (err) {
        return {
            code: 0,// 异常
            msg: "token异常"
        }
    }
}
// 生成token
module.exports.enToken = function (payload) {
    return jwt.encode({
        ...payload,
        ...{
            lastTime: Date.now() + 60 * 1000 * 30 //30分钟
        }
    }, tokenKey)
}

//UUID
module.exports.uuid = function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 16; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    //s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    //s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    //s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}

//  get 请求
exports.requestGet = async (url, params = {}) => {
    return new Promise((resolve, reject) => {
        request.get(url, {
            qs: params
        }, (err, res, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        })
    })
}
// post 请求
exports.requestPostForm = async (url, data = {}) => {
    return new Promise((resolve, reject) => {
        request.post( {url,
            formData:data
        }, (err, res, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        })
    })
}
exports.requestPost = async (url, params = {}) => {
    return new Promise((resolve, reject) => {
        request.post(url, {
            json: params
        }, (err, res, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        })
    })
}
