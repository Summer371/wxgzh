
// 回复文本消息
exports.textMsg = function(toUser,fromUser,content){
    var xmlContent =  "<xml><ToUserName><![CDATA["+ toUser +"]]></ToUserName>";
        xmlContent += "<FromUserName><![CDATA["+ fromUser +"]]></FromUserName>";
        xmlContent += "<CreateTime>"+ new Date().getTime() +"</CreateTime>";
        xmlContent += "<MsgType><![CDATA[text]]></MsgType>";
        xmlContent += "<Content><![CDATA["+ content +"]]></Content></xml>";
    return xmlContent;
}
// 回复文本消息
exports.textMsg2 = function(toUser,fromUser,content){
    var xmlContent =  "<xml><ToUserName><![CDATA["+ toUser +"]]></ToUserName>";
    xmlContent += "<FromUserName><![CDATA["+ fromUser +"]]></FromUserName>";
    xmlContent += "<CreateTime>"+ new Date().getTime() +"</CreateTime>";
    xmlContent += "<MsgType><![CDATA[text]]></MsgType>";
    xmlContent += "<Content><![CDATA["+ content.map(i=>i).join('\n') +"]]></Content></xml>";
    return xmlContent;
}

// 回复图文消息
exports.graphicMsg = function(toUser,fromUser,contentArr){
    var xmlContent =  "<xml><ToUserName><![CDATA["+ toUser +"]]></ToUserName>";
       xmlContent += "<FromUserName><![CDATA["+ fromUser +"]]></FromUserName>";
       xmlContent += "<CreateTime>"+ new Date().getTime() +"</CreateTime>";
       xmlContent += "<MsgType><![CDATA[news]]></MsgType>";
       xmlContent += "<ArticleCount>"+contentArr.length+"</ArticleCount>";
       xmlContent += "<Articles>";
       contentArr.map(function(item,index){
           xmlContent += "<item>";
           xmlContent += "<Title><![CDATA["+ item.title +"]]></Title>";
           xmlContent += "<Description><![CDATA["+ item.description +"]]></Description>";
           xmlContent += "<PicUrl><![CDATA["+ item.picUrl +"]]></PicUrl>";
           xmlContent += "<Url><![CDATA["+ item.url +"]]></Url>";
           xmlContent += "</item>";
       });
       xmlContent += "</Articles></xml>";
   return xmlContent;
}

// 回复图片
exports.imgMsg = function(toUser, fromUser, media_id) {
    var xmlContent = "<xml><ToUserName><![CDATA["+ toUser +"]]></ToUserName>";
        xmlContent += "<FromUserName><![CDATA["+ fromUser +"]]></FromUserName>";
        xmlContent += "<CreateTime>"+ new Date().getTime() +"</CreateTime>";
        xmlContent += "<MsgType><![CDATA[image]]></MsgType>";
        xmlContent += "<Image><MediaId><![CDATA["+ media_id +"]]></MediaId></Image></xml>";
    return xmlContent;
}

// 回复语音
exports.vodeoMsg = function(toUser, fromUser, media_id, title, description) {
    var xmlContent = "<xml><ToUserName><![CDATA["+ toUser +"]]></ToUserName>";
        xmlContent += "<FromUserName><![CDATA["+ fromUser +"]]></FromUserName>";
        xmlContent += "<CreateTime>"+ new Date().getTime() +"</CreateTime>";
        xmlContent += "<MsgType><![CDATA[video]]></MsgType>";
        xmlContent += "<Video><MediaId><![CDATA["+ media_id +"]]></MediaId>";
        xmlContent += "<Title><![CDATA["+ title +"]]></Title>";
        xmlContent += "<Description><![CDATA["+ description +"]]></Description></Video></xml>";
    return xmlContent;
}

//回复音乐
exports.musicMsg = function(toUser, fromUser, media_id,MusicURL,title,description) {
    var xmlContent = "<xml>"
    xmlContent += "<ToUserName><![CDATA["+ toUser +"]]></ToUserName>"
    xmlContent += "<FromUserName><![CDATA["+ fromUser +"]]></FromUserName>"
    xmlContent += "<CreateTime>"+ new Date().getTime() +"</CreateTime>"
    xmlContent += "<MsgType><![CDATA[music]]></MsgType>"
    xmlContent += "<Music>"
    xmlContent +=  "<Title><![CDATA["+ title +"]]></Title>"
    xmlContent +=  "<Description><![CDATA["+description+"]]></Description>"
    xmlContent +=  "<MusicUrl><![CDATA["+ MusicURL +"]]></MusicUrl>"
    xmlContent +=  "<HQMusicUrl><![CDATA["+ MusicURL +"]]></HQMusicUrl>"
    xmlContent +=  "<ThumbMediaId><![CDATA["+ media_id +"]]></ThumbMediaId>"
    xmlContent += "</Music>"
    xmlContent += "</xml>"
    return xmlContent;
}
