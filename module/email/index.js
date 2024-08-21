/*
 * @Author: csg
 * @Date: 2023/4/26 12:12
 * @Description: Description
 */
const nodemailer = require("nodemailer");

// 发送邮件函数

const sendMail = function (to,subject,html,fileName="",path="") {

    // 创建一个smtp客户端配置

    const config = {

        service: "163", // 注意事项   service: '163"', // 使用了内置传输发送邮件,具体可查看支持列表：https://nodemailer.com/smtp/well-known/

        auth: {

            // 发件人邮箱账号

            user: 'xiaogangtechnology@163.com',   //

            //发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一

            pass: 'U*********L' //授权码生成之后，要等一会才能使用，否则验证的时候会报错

        }

    }

    const transporter = nodemailer.createTransport(config)

    //创建一个收件人对象

    const mail = {

        // 发件人 邮箱 '昵称<发件人邮箱>'

        from: `"小刚科技站"<xiaogangtechnology@163.com>`,

        // 主题

        subject: subject,

        // 收件人 的邮箱

        to: to,

        //这里可以添加html标签

        html: html,

        //附件
        // attachments: [{
        //     // 文件名
        //     filename: 'app.js',
        //     // 文件路径
        //     path: './app.js'
        // }]
    }
    return new Promise((resolve,reject) => {
        transporter.sendMail(mail, function(error, info) {
            if (error) {
                console.log(error);
                reject(error)
            }
            transporter.close()
            console.log('mail send success:', info.response)
            resolve(info.response)
        })
    })
}

module.exports = {
    sendMail
};
