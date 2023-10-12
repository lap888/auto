/* 我方主播直播间互动 主要功能 1. 同步守护主播直播间评论区信息 但我方守护人员发言不能同步 2.将我方主播直播间评论区用户发言同步到守护直播间 但我方互动人员发言不同步
 * @Author: topbrids@gmail.com 
 * @Date: 2023-05-12 21:31:41 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-05-22 01:01:55
 */

log('微信视频号-直播姬-互动-启动')
let blackau = ['终老少年', '天天']
let saylist = []
let h = device.height;
let w = device.width;
let num = 0
let postList = ['你火了', '快醒醒', '你火了 快醒醒', '快醒醒 你火了', '你🔥了', '你🔥了 快醒醒', '快醒醒 你🔥了', '腾讯流量池打开了🐂 🍺', '腾讯给你推流了🐂 🍺']

while (true) {
    num = 0
    let ftc = id("com.tencent.mm:id/ftc").exists()
    if (ftc) {
        num = id("com.tencent.mm:id/ftc").findOne().text();
        num = num.replace('人看过', '')
    }
    let pl_text = postList[Math.floor(Math.random() * postList.length)]
    if (num != 0) {
        pl_text = pl_text + ', 直播间突破' + num + '人了'
    }
    send(pl_text)
    mylog('发送评论区消息' + pl_text)
    mylog('长按3秒点赞')
    longClickDz()
    sleep(random(2000, 3500))
}

// setInterval(() => {
//     // getsayc()
//     // send('你火了')
//     longClickDz()
// }, random(2000, 4500));

// send('啊哈哈😝')
// getsayc()

/**
 * 封装一个长按点赞
 */
function longClickDz() {
    let dz = id("com.tencent.mm:id/dp8").exists()
    if (dz) {
        let widget = id("com.tencent.mm:id/dp8").findOne();
        press(widget.bounds().centerX() < 0 ? 0 : widget.bounds().centerX(), widget.bounds().centerY() < 0 ? 0 : widget.bounds().centerY(), 3000);
    }
}
/**
 * 封装一个发送消息方法
 * @param {*} str 
 */
function send(str) {
    // 
    let lyl = id("com.tencent.mm:id/e1n").exists()
    if (lyl) {
        id("com.tencent.mm:id/e1n").findOne().parent().click()
        sleep(random(1000, 1500))
    }
    //
    setText(str)
    //
    back()
    //
    let sendbtn = id("com.tencent.mm:id/fyf").exists()
    if (sendbtn) {
        id("com.tencent.mm:id/fyf").findOne().click()
        sleep(random(1000, 1500))
    }
}

/**
 * 封装一个获取评论区发言
 */
function getsayc() {
    try {
        let sayc = id("com.tencent.mm:id/djn").exists()
        if (sayc) {
            let saylength = id("com.tencent.mm:id/djn").findOne().children().length
            if (saylength > 0) {
                let fristsay = id("com.tencent.mm:id/djn").findOne()
                if (fristsay.child(0) != null && fristsay.child(0).child(0) != null && fristsay.child(0).child(0).child(0) != null) {
                    let esayc = fristsay.child(0).child(0).child(0).text()
                    let au = esayc.split('：')
                    if (blackau.indexOf(au[0]) == -1) {
                        let say1 = au[0] + ',说:' + au[1]
                        if (saylist.indexOf(say1) == -1 && au[1] != undefined) {
                            log(say1)
                            saylist.push(say1)
                        }
                    }
                }
            }
            //
            i_move(w / 2, h * 0.85)
        }
    } catch (e) {
        log('封装一个获取评论区发言发生错误', e)
    }
}

/**
 * 评论列表滑动
 * @param {*} x1 
 * @param {*} y1 
 */
function i_move(x1, y1) {
    y1 = random(y1 - 10, y1 + 10)
    swipe(random(x1 - 25, x1 + 25), y1, random(x1 - 25, x1 + 25), y1 - 250, 500)
}

/**
 * log
 * @param {*} text 
 */
function mylog(text) {
    textLog = ':: ' + text
    log(textLog)
    sleep(random(1000, 1500))
}