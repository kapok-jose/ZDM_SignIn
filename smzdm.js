const request = require('request');
const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: '/www/qiandao/SMZDM/logs/cheese.log' } },         //服务器上写入日志需要绝对路径，不然回写到root目录下面
    // appenders: { cheese: { type: 'file', filename: './logs/cheese.log' } },                             //本地调试直接用项目相对路径
    categories: { default: { appenders: ['cheese'], level: 'info' } }
});
const logger = log4js.getLogger('cheese');

let url = 'https://zhiyou.smzdm.com/user/checkin/jsonp_checkin'             //张大妈签到接口地址
let cookie = '__ckguid=YCgFRbGOBiuwUpiuLE25i3; device_id=30857186231558598882161956c39afb6dffa7aa9a9bf16fae7402da9b; __jsluid=5f1a1c6d2737004d55b2662536a2c747; _ga=GA1.2.124300571.1558598738; homepage_sug=j; r_sort_type=score; __jsluid_s=30d24950afda746970de279507ff14f5; __gads=ID=57636ec32dbd2a0e:T=1562218994:S=ALNI_Mat8tW6wOYsghhvAP00DBCDUWs5HQ; shequ_pc_sug=a; smzdm_user_source=148BBD8E8CC3616D22C772B7E632FA2A; wt3_eid=%3B999768690672041%7C2156222035400855662%232158693397500377886; _gid=GA1.2.60351216.1589792584; DISABLE_APP_TIP=1; zdm_qd=%7B%22referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DJzpGBgsWmjV2Xy5EgW3HXDIZVSy4H65toawO-UrYwS6gvLg9CihpfIrtOuTxRWUY%26wd%3D%26eqid%3D91f30a0c00006ee9000000065ec25899%22%7D; Hm_lvt_9b7ac3d38f30fe89ff0b8a0546904e58=1589017126,1589792583,1589850558; sess=OGMxOTF8MTU5MzczODU5MXw0MzU1ODE4NzIwfGU2YjU0ZTRiYmExYjc0YTljNzJmZjc2MDJjMGZjZjM4; user=user%3A4355818720%7C4355818720; smzdm_id=4355818720; _zdmA.uid=ZDMA.AVDZKPIS0.1589850867.2419200; _gat_UA-27058866-1=1; smzdm_user_view=1BF66A91DAC84F429CEE3978493C4B21; Hm_lpvt_9b7ac3d38f30fe89ff0b8a0546904e58=1589850900'  //张大妈的cookie
let serverSauceToken = 'SCT62846TgprwJPZG5JZx4oGkrp1MzaOZ'                     //Server酱 Token

let requestData = () => {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: 'GET',
            headers: {
                "Accept": "*/*",
                "Connection": 'keep-alive',
                "Cookie": cookie,
                "Referer": "https://www.smzdm.com/",
                "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.3',
            }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(body)
            } else {
                logger.info(`签到失败error------------------${body}`);
                request({
                    url: encodeURI(`https://sc.ftqq.com/${serverSauceToken}.send?text=签到失败&desp=快去手动签到`),
                    method: 'GET',
                },(error, response, body)=>{
                    try {
                        logger.info(`签到失败------------------------${body}`);
                        console.log(`签到失败------------------------${body}`)
                    } catch (error) {
                        console.log('推送失败，推送系统凉了，小朋友')
                        logger.info('推送失败，推送系统凉了，小朋友')
                    }
                    
                })
                reject(err)
            }
        })
    })
}

requestData().then(req => {
    console.log(`签到成功success------------------${req}`)
    // 打印日志
    logger.info(`签到成功success------------------${req}`);
    let bodyData = JSON.parse(req)
    console.log(`签到成功，已签到${bodyData.data.checkin_num}天`)
    // 推送签到回调到微信
    request({
        url: encodeURI(`https://sc.ftqq.com/${serverSauceToken}.send?text=签到成功(${bodyData.data.checkin_num}天)&desp=${new Date()}---已签到${bodyData.data.checkin_num}天`),
        method: 'GET',
    },(error, response, body)=>{
        try {
            logger.info(`微信推送的回调结果------------------------${body}`);
        } catch (error) {
            logger.info('推送失败，推送系统凉了，小朋友')
        }
        
    })
})


