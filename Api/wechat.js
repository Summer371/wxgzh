/*
 * @Author: csg
 * @Date: 2024/8/16 19:24
 * @Description: Description
 */

const baseApi = "https://api.weixin.qq.com/";
const appID = process.env["APPID"]
const appScrect = process.env["APPSECRECT"]
module.exports = {
    getAccessToken: () => `${baseApi}cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appScrect}`,
    createMenu: (access_token) => `${baseApi}cgi-bin/menu/create?access_token=${access_token}`,
    uploadFile: (access_token, type = 'image') => `${baseApi}cgi-bin/media/upload?access_token=${access_token}&type=${type}`,
    sendMsg: (access_token) => `${baseApi}cgi-bin/message/custom/send?access_token=${access_token}`,
    materialList: (access_token) => `${baseApi}cgi-bin/material/batchget_material?access_token=${access_token}`,
    getUserInfomation: (access_token,openid) => `${baseApi}cgi-bin/user/info?access_token=${access_token}&openid=${openid}&lang=zh_CN`,
}
