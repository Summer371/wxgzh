/*
 * @Author: csg
 * @Date: 2023/5/23 19:55
 * @Description: Description
 */
const SMSClient = require('@alicloud/sms-sdk');
// 设置值
let accessKeyId = "LTAI5t*************Yh";// AccessKey ID
let secretAccessKey = "JBMSR***********VoD1irAPta0";// AccessKey Secret
let signName = "小刚信息站"; // 签名名称
let templateCode = "SMS_xxx";// 短信模板code

// 初始化sms_client
const smsClient = new SMSClient({accessKeyId, secretAccessKey})

module.exports = smsMsg = (phone="1337xxxx9070") => {
    // 生成六位随机验证码
    let smsCode = Math.random().toString().slice(-6);
    return new Promise((resolve,reject)=>{
        // 开始发送短信
        smsClient.sendSMS({
            PhoneNumbers: phone,
            SignName: signName, //签名名称 前面提到要准备的
            TemplateCode: templateCode, //模版CODE  前面提到要准备的
            TemplateParam: `{"code":'${smsCode}'}`, // 短信模板变量对应的实际值，JSON格式
        }).then(result => {
            console.log("result：", result)
            let {Code} = result;
            if (Code == 'OK') {
                resolve(result)
            }
        }).catch(err => {
            console.log("报错：", err);
            reject(err)
        })
    })

};



