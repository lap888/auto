/* 提词器
 * @Author: topbrids@gmail.com 
 * @Date: 2023-06-13 17:16:25 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-06-13 18:17:13
 */


const { wordtext, wordtime, wordlen } = hamibot.env;

let saylist = []
let h = device.height;
let w = device.width;
let textLog = ""
let window;
let thread1 = null;
let thread2 = null;
let num = 0
let storage = null;

let postList = ['你火了', '快醒醒', '你火了 快醒醒', '快醒醒 你火了', '你🔥了', '你🔥了 快醒醒', '快醒醒 你🔥了', '腾讯流量池打开了🐂 🍺', '腾讯给你推流了🐂 🍺']
let historysay = []
let pushlist = []
let pulllist = []
main()

/**
 * 主入口
 */
function main() {
    try {
        show()
        saylist = wordtext.split('')
        let a1 = parseInt(saylist.length / wordlen)
        let a2 = saylist.length % wordlen
        let a3 = '除数' + a1 + '余数' + a2
        // mylog(a3)
        let pushlist = []
        let w0 = ''
        let num = 0
        for (let i = 0; i < a1; i++) {
            w0 = wordtext.substring(num, num + 10)
            num += 10
            pushlist.push(w0)
            // mylog('第' + i + '句:' + w0)
        }
        let lastw = wordtext.substring(saylist.length - a2)
        // mylog('最后一句:' + lastw)
        pushlist.push(lastw)
        let num2 = 0
        while (true) {
            if (num2 > pushlist.length - 1) {
                num2 = 0
                mylog('循环播放')
            }
            mylog(pushlist[num2])
            num2++
            // mylog('休息' + wordtime + '秒')
            sleep(wordtime * 1000)
        }


    } catch (e) {
        log(e)
        hamibot.exit();
    }
}

function show() {
    if (window) {
        window.close();
    }
    mylog('提词器启动')
    thread1 = threads.start(function () {
        window = floaty.rawWindow(
            <frame w='*' h='*' gravity='center' bg="#FF6347" alpha="0.6">
                <text margin='10 10 10 10' padding='10 15 10 5' id='textLog' textColor="#ffffff" textSize="18sp" />
            </frame>
        );
        setInterval(() => {
            ui.run(function () {
                window.textLog.setText(textLog);
            });
        }, 1000);
        ui.post(function () {
            window.setPosition(50, -5);
        }, 300);
    })
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
    // back()
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


