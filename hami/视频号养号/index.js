// "ui";
/* 视频号养号
 * @Author: topbrids@gmail.com 
 * @Date: 2023-02-22 21:27:33 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-05-21 16:24:41
 */
const { myPhone, sleepTime, myIsgz, dzcountTotal, hdplhsFix, qdplhsFix,proId } = hamibot.env;
let window;
let thread1 = null;
let thread2 = null;
let h = device.height;
let w = device.width;
let textLog = ""
let likeErrorCount = 0
let androidId = device.getAndroidId();
let dzCount = 0 //点赞次数
let dzCountTotal = Number(dzcountTotal) // 本次点赞次数

let nowName = ''
let oldName = ''
let emojy = "👍,😘,🤡,🤠,🍑,🍅,🍉,❤️,🍎,🍊,🍋,🍌,🍉,🍅,🥑,🥝,🍍,🍑,🍒,🍈,🍓,🍖,🍔,🍟,🌭,🍕,🍣,🍿,🍩,🍪,🥛,🍺,🍻,🍷,🍸,🍹,🥂"
emojy = emojy.split(',')

let postList = qdplhsFix.split(',')//['早上好', '喜欢的点点关注', '真不错~', '加油~', '不错哟~', 'nice', '支持,上个热门~', '支持一个~', '厉害了~', '过来看看~']
let storage = null;

core()

function core() {
    show()
    let date = DateFormat()
    let devicestr = 'topbrids@gmail.com' + '-' + date + "-" + proId
    // mylog('设备:' + devicestr + '分辨率: h=' + h + ',w=' + w)
    storage = storages.create(devicestr);

    let isplbtn = id('com.tencent.mm:id/f1t').exists()
    let islive = id('com.tencent.mm:id/g10').exists()
    let count0 = 0
    while (!isplbtn && !islive) {
        mylog('等待进入视频号:' + count0)
        count0++
        sleep(random(1000, 1500))
        isplbtn = id('com.tencent.mm:id/f1t').exists()
        continue;
    }
    mylog('已经进入视频号')

    thread2 = threads.start(function () {
        while (true) {
            islive = id('com.tencent.mm:id/g10').exists()
            let isplnum = id('com.tencent.mm:id/bje').exists()
            if (!islive && isplnum) {
                let plnum = id('com.tencent.mm:id/bje').findOne().text()
                mylog('评论数量:' + plnum)
                mylog('点击评论')
                id('com.tencent.mm:id/bjq').findOne().click()
                sleep(random(2000, 3500))
                // 评论点赞 
                let nowDzpl = 0
                let nowDzplsame = 0
                let plc = []
                let auname = ''
                let pls0 = []
                // mylog('dzCount:' + dzCount + ',dzCountTotal:' + dzCountTotal + ',plnum:' + plnum)
                while (dzCount < dzCountTotal && plnum < 200) {
                    let pls = id('com.tencent.mm:id/lwb').find()
                    pls0 = pls
                    plc = id('com.tencent.mm:id/bga').find()
                    let names = id('com.tencent.mm:id/hft').find()
                    if (names[0] == undefined) {
                        sleep(1000)
                        mylog('names[0]' + '不存在')
                        continue
                    }
                    nowName = names[0].text()
                    if (auname == '') {
                        auname = nowName
                    }
                    let oldDz = storage.get('dz')
                    if (oldDz == undefined) {
                        oldDz = []
                    } else {
                        oldDz = JSON.parse(oldDz)
                    }
                    dzCount = oldDz.length;
                    let line = className('android.widget.LinearLayout').depth(3).drawingOrder(2).indexInParent(1);
                    if (line.exists() || (oldName == nowName && auname != nowName)) {
                        oldName = nowName = ''
                        mylog('评论滑动出现下划线，到底跳出')
                        break;
                    } else {
                        if (pls[0] != undefined) {
                            let tmp_n = pls[0].bounds()
                            let dz = oldDz.findIndex(v => v.name == nowName)
                            if (dz == -1) {
                                click(tmp_n.centerX(), tmp_n.centerY())
                                dzCount++
                                nowDzpl++
                                oldDz.push({ name: nowName })
                                storage.put('dz', JSON.stringify(oldDz))
                            } else {
                                mylog('今日' + nowName + '已点赞,本次不点')
                            }
                            if (oldName == nowName) {
                                nowDzplsame++
                            }
                            oldName = nowName
                            i_move(w / 3, h * 0.85)
                            if (nowDzpl > 8) {
                                mylog('防风控,自动切换下一个视频')
                                break
                            }
                            if (nowDzplsame > 3) {
                                mylog('超过三次名称重复 跳出')
                                break
                            }
                        } else {
                            mylog('未获取到评论')
                            break;
                        }
                    }
                    mylog(nowName + '点赞第' + dzCount + '次，该视频已点' + nowDzpl)
                }

                mylog('点完关闭评论' + '今日已点赞第' + dzCount + '次')
                let emojytext = getEmojy()
                let pl_text1 = ',' + hdplhsFix
                let pl_text2 = postList[Math.floor(Math.random() * postList.length)]
                let plc1 = pl_text2
                if (plc[0] != '' && plc[0] != undefined) {
                    if (plc.length > 3) {
                        plc1 = plc1 + plc[3].text()
                    }
                }
                let qpText = ''
                if (plnum <= 0) {
                    qpText = '沙发 占楼 支持' + emojytext
                    plc1 = pl_text2

                } else if (plnum <= 1) {
                    qpText = '二楼 占楼 支持' + emojytext
                    plc1 = pl_text2
                } else if (plnum <= 2) {
                    qpText = '三楼 占楼 支持' + emojytext
                    plc1 = pl_text2
                }
                let emojy_text = emojy[Math.floor(Math.random() * emojy.length)]
                setText(qpText + plc1 + emojy_text + pl_text1 + emojytext)
                mylog('准备评论')
                if (id('com.tencent.mm:id/ipi').exists()) {
                    id('com.tencent.mm:id/ipi').findOnce().click()
                    mylog('随机评论')
                }
                back()
            } else {
                mylog('评论不存在')
            }

            h_move(w / 2, h * 0.9, w / 2, h * 0.1)

            sleep(random(2000, 3500))
            if (likeErrorCount > 10) {
                alert('提示', '连续10次关注失败...')
            }
        }
    })
}

function getEmojy() {
    let emojy_text = emojy[Math.floor(Math.random() * emojy.length)]
    //随机加表情
    let emojy_arr = Math.floor(Math.random() * 3)
    for (let i = 0; i < emojy_arr; i++) {
        emojy_text = emojy_text + emojy[Math.floor(Math.random() * emojy.length)]
    }
    return emojy_text
}
function show() {
    mylog('视频号养号脚本启动')
    thread1 = threads.start(function () {
        // window = floaty.rawWindow(
        //     <frame w='*' h='*' gravity='center' bg="#000000" alpha="0.6">
        //         <text padding='10 10 10 5' id='textLog' textColor="#ffffff" textSize="15sp" />
        //     </frame>
        // );
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

function mylog(text) {
    textLog = ':: ' + text
    log(textLog)
    sleep(random(1000, 1500))
}


function find_click_ui(ids, isClick) {
    let tmp = id(ids).findOne()
    if (tmp) {
        if (isClick) {
            let tmp2 = tmp.bounds()
            click(tmp2.centerX() < 0 ? 0 : tmp2.centerX(), tmp2.centerY() < 0 ? 0 : tmp2.centerY())
        }
        return true;
    } else {
        return false;
    }
}

function h_move(x1, y1, x2, y2) {
    mylog('滑动视频')
    swipe(random(x1 - 25, x1 + 25), random(y1 - 25, y1 + 25), random(x2 - 25, x2 + 25), random(y2 - 25, y2 + 25), random(400, 500))
    sleep(random(1000, 1500))
}

function i_move(x1, y1) {
    mylog('滑动评论')
    y1 = random(y1 - 10, y1 + 10)
    swipe(random(x1 - 25, x1 + 25), y1, random(x1 - 25, x1 + 25), y1 - 400, 450)
    sleep(random(1000, 1500))
}


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