/* 我方主播直播间互动 主要功能 1. 同步守护主播直播间评论区信息 但我方守护人员发言不能同步 2.将我方主播直播间评论区用户发言同步到守护直播间 但我方互动人员发言不同步
 * @Author: topbrids@gmail.com 
 * @Date: 2023-05-12 21:31:41 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-06-04 20:23:14
 */
const { proId, action, blackaulist } = hamibot.env;
let blackau = blackaulist.split(',')//['是**', '是孤影1996啊']

let au1 = '孤影'
let au2 = '老浪'
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
        let devicestr = 'topbrids@gmail.com' + ':wxsphlivetx:' + proId
        storage = storages.create(devicestr);
        mylog(blackau[0] + action)
        let islive = id('com.tencent.mm:id/g0w').exists()
        let count0 = 0
        while (!islive) {
            mylog('等待进入视频号直播间:' + count0)
            count0++
            sleep(random(1000, 1500))
            islive = id('com.tencent.mm:id/g0w').exists()
            continue;
        }
        mylog('已经进入视频号直播间')

        while (true) {
            let issayshop = id('com.tencent.mm:id/be4').exists()
            if (issayshop) {
                id('com.tencent.mm:id/be4').findOne().click()
                mylog('关闭讲解商品')
            }
            let issaygame = id('com.tencent.mm:id/dh0').exists()
            if (issaygame) {
                id('com.tencent.mm:id/dh0').findOne().click()
                mylog('关闭讲解游戏')
            }
            let nextpage = id('com.tencent.mm:id/fsx').exists()
            if (nextpage) {
                id('com.tencent.mm:id/fsx').findOne().click()
                mylog('点击下一页')
            }

            let issay = id('com.tencent.mm:id/fsv').exists()
            if (issay) {
                id('com.tencent.mm:id/fsv').find().forEach(e => {
                    let context = e.text()
                    let cl = context.split('：')
                    if (cl.length == 2) {
                        let pp1 = cl[0]
                        let pp2 = cl[1]
                        // 采集直播间留言
                        if (blackau.indexOf(pp1) == -1 && historysay.indexOf(pp2) == -1) {
                            // mylog('采集' + pp1 + '说：' + pp2)
                            historysay.push(pp2)
                            //推
                            RemoteAddWxmsg(pp1, pp2)
                        }
                    }
                });
                mylog('滑动评论区')
                i_move(w / 2, h * 0.85)
            }
            //拿对方的文案说
            pulllist = RemoteFind(action)
            pulllist.forEach(e => {
                // mylog('对手说:' + e.text)
                send(e.text)
            });
            mylog('拉取远端评论结束')
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
    mylog('微信视频号-直播-互动')
    thread1 = threads.start(function () {
        window = floaty.rawWindow(
            <frame w='*' h='*' gravity='center' bg="#FF6347" alpha="0.6">
                <text padding='10 20 10 5' id='textLog' textColor="#ffffff" textSize="15sp" />
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

/**
 * 
 * @param {*} time 
 * @returns 
 */
function DateFormat(time) {
    let myDate = ''
    if (time == undefined) {
        myDate = new Date();
    } else {
        myDate = new Date(time);
    }
    let year = myDate.getFullYear();
    let mon = myDate.getMonth() + 1;
    if (mon < 10) {
        mon = "0" + mon;
    }
    let date = myDate.getDate();
    if (date < 10) {
        date = "0" + date;
    }
    let now = year + "-" + mon + "-" + date;
    return now;
}


/**
 * 远程查询点赞
 * @param {} action 
 * @returns 
 */
function RemoteFind(action) {
    let findDz2Url = 'http://101.32.178.79:30019/api/wxlivelist?proId=' + proId + '&action=' + action
    let findDz2Res = http.get(findDz2Url);
    findDz2Res = findDz2Res.body.json()
    if (findDz2Res.code == 200) {
        return findDz2Res.list
    }
    return [];
}
/**
 * 上报直播间消息
 * @param {*} name
 * @param {*} context 
 */
function RemoteAddWxmsg(name, context) {
    let addDz2Url = 'http://101.32.178.79:30019/api/wxliveadd?name=' + name + '&action=' + action + '&proId=' + proId + '&context=' + context
    http.get(addDz2Url);
}