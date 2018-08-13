/* 跳转的表单地址 */
window.JumpUrl = "https://www.wenjuan.com/s/7Rz2Yn/";


/* 图片资源host地址 */
window.BaseUrl = "https://maimai.cn/ent/imgs/";

/* 
  微信签名接口地址 
* 接收1个参数url
* 接口返回内容
*/

let ReturnParams = {
    success: true,
    data: {
        "debug": true,
        "appId": "wxb17a5a75c9ad192b",
        "timestamp": "1533897246",
        "nonceStr": "b9aab9c2ii",
        "signature": "d1c126bbcaff2f48d415fd71e92684978c0e1a1c",
        "jsApiList": [
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "onMenuShareQZone"
        ]
    }
}


window.SignInterfaceLink = "https://maimai.cn/api/ent/web/get";


/* 分享内容的相关配置 */
window.ShareConfig = {
    title: "如何优雅的回怼“你很好，但我们不适合 ”",
    desc: "每天都和很多人擦肩而过，最后他们都成了我的...",
    link: window.location.href,
    imgUrl: "https://static.mmcai.cn/static/36/lg/imgs/icon.jpg"
}





