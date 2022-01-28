const $ = new Env('张大妈签到');
const notify = $.isNode() ? require('./sendNotify') : '';
const request = require('request');
// const log4js = require('log4js');
// log4js.configure({
//     appenders: { cheese: { type: 'file', filename: '/www/qiandao/SMZDM/logs/cheese.log' } },         //服务器上写入日志需要绝对路径，不然回写到root目录下面
//     // appenders: { cheese: { type: 'file', filename: './logs/cheese.log' } },                             //本地调试直接用项目相对路径
//     categories: { default: { appenders: ['cheese'], level: 'info' } }
// });
// const logger = log4js.getLogger('cheese');

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
                // logger.info(`签到失败error------------------${body}`);
                request({
                    url: encodeURI(`https://sc.ftqq.com/${serverSauceToken}.send?text=签到失败&desp=快去手动签到`),
                    method: 'GET',
                },(error, response, body)=>{
                    try {
                        // logger.info(`签到失败------------------------${body}`);
                        console.log(`签到失败------------------------${body}`)
                    } catch (error) {
                        console.log('推送失败，推送系统凉了，小朋友')
                        // logger.info('推送失败，推送系统凉了，小朋友')
                    }
                    
                })
                reject(err)
            }
        })
    })
}

requestData().then(req => {
    console.log(`签到成功success------------------${req}`)
    notify.sendNotify(`签到成功success------------------${req}`)
    // 打印日志
    logger.info(`签到成功success------------------${req}`);
    let bodyData = JSON.parse(req)
    console.log(`签到成功，已签到${bodyData.data.checkin_num}天`)
    // 推送签到回调到微信
    // request({
    //     url: encodeURI(`https://sc.ftqq.com/${serverSauceToken}.send?text=签到成功(${bodyData.data.checkin_num}天)&desp=${new Date()}---已签到${bodyData.data.checkin_num}天`),
    //     method: 'GET',
    // },(error, response, body)=>{
    //     try {
    //         logger.info(`微信推送的回调结果------------------------${body}`);
    //     } catch (error) {
    //         logger.info('推送失败，推送系统凉了，小朋友')
    //     }
        
    // })
})
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}


