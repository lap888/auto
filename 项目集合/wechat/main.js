auto()
toastLog('微信点赞脚本启动')

let sub_log = true;
let h = device.height;
let w = device.width;

let nowName = ''
let oldName = ''
let dtime = 1500
let dzCount = 0
let dzCountTotal = 200
let s_name = '小师妹6166'



home()
sleep(1000)
launchApp('微信')
// launch('ccom.tencent.mm')
sleep(1000)

// let tmp = id('com.tencent.mm:id/kd_').visibleToUser().findOnce()
// toastLog(tmp)
// tmp.click()

text('发现').findOnce().parent().click()
sleep(random(2000, 3000))

find_click_ui('com.tencent.mm:id/gsl', true)
sleep(random(2000, 3000))

let search = id('com.tencent.mm:id/cd7').visibleToUser().findOnce()

search.setText(s_name)
sleep(random(2000, 3000))

find_click_ui('com.tencent.mm:id/lm0', true)

sleep(random(3000, 4000))

let sph = className('android.view.View').depth(15).visibleToUser().findOnce()
if (sph && sph != '') {
    toastLog('1sph=', sph)
    let sphb = sph.bounds()
    click(sphb.centerX(), sphb.centerY())
} else {
    sph = className('android.view.View').depth(15).visibleToUser().findOnce()
    toastLog('2sph=', sph)
    let sphb = sph.bounds()
    click(sphb.centerX(), sphb.centerY())
}


sleep(random(2000, 3000))

let sps = id('com.tencent.mm:id/i5j').visibleToUser().find()
toastLog("主页视频个数|" + sps.length)
if (sps.length > 1) {
    let tmp = sps[2].bounds()
    click(tmp.centerX(), tmp.centerY())
    sleep(random(2000, 3000))
    //大视频
    while (dzCount < dzCountTotal) {
        //第一条评论点赞
        while (dzCount < dzCountTotal) {
            find_click_ui('com.tencent.mm:id/bjq', true)
            sleep(3000)
            let pls = id('com.tencent.mm:id/lwb').visibleToUser().find()

            let names = id('com.tencent.mm:id/hft').visibleToUser().find()
            if (names[0] == undefined) {
                sleep(1000)
                continue
            }
            nowName = names[0].text()

            toastLog('nowName' + nowName)
            let line = className('android.widget.LinearLayout').depth(3).drawingOrder(2).indexInParent(1).visibleToUser();
            if (line.exists()) {
                pls.forEach((v, i) => {
                    if (i > 1) {
                        let tmp_n = pls[i - 1].bounds()
                        if (nowName == s_name) {
                            toastLog('::作者评论不点赞')
                        } else {
                            click(tmp_n.centerX(), tmp_n.centerY())
                            dzCount++
                        }
                        sleep(2000)
                    }
                });
                oldName = nowName = ''
                toastLog('::评论滑动出现下划线，到底跳出')
                back()
                break;
            } else {
                toastLog("::当前页评论条数|" + pls.length + "|" + nowName)
                if (pls[0] != undefined) {
                    let tmp_n = pls[0].bounds()
                    if (nowName == s_name) {
                        toastLog('::作者评论不点赞')
                    } else {
                        click(tmp_n.centerX(), tmp_n.centerY())
                        dzCount++
                    }
                    sleep(1000)
                    i_move(w / 2, h * 0.85)
                    oldName = nowName
                } else {
                    toastLog('::未获取到评论')
                    back()
                    break;
                }
            }
            log('点赞第' + dzCount + '次')
        }
        sleep(3000)
        //滑动下一个视频
        h_move(w / 2, h * 0.8, w / 2, h * 0.1)
        sleep(2000)
        //判断到底是否
        let line2 = className('android.widget.LinearLayout').depth(2).drawingOrder(2).indexInParent(4).visibleToUser();
        if (line2.exists()) {
            toastLog('::大视频滑动出现下划线，到底跳出')
            back()
            break;
        }
        sleep(2000)
    }
    //
    toastLog('::点赞完成')
} else {
    toastLog('无视频返回')
}



//

//
// 打开微信
//点击发现
//点击放大镜
//点击视频号
//while

//搜索指定视频号主
//进入视频号主
//进入号主视频
//点开评论
//搜索评论
//点赞

function find_click_ui(ids, isClick) {
    let tmp = id(ids).visibleToUser().findOnce()
    if (tmp) {
        if (isClick) {
            let tmp2 = tmp.bounds()
            click(tmp2.centerX(), tmp2.centerY())
        }
        return true;
    } else {
        return false;
    }
}

function h_move(x1, y1, x2, y2) {
    if (sub_log) { log('::滑动屏幕') }
    swipe(random(x1 - 25, x1 + 25), random(y1 - 25, y1 + 25), random(x2 - 25, x2 + 25), random(y2 - 25, y2 + 25), random(400, 500))
    sleep(dtime)
}

function i_move(x1, y1) {
    if (sub_log) { log('::滑动屏幕') }
    y1 = random(y1 - 10, y1 + 10)
    swipe(random(x1 - 25, x1 + 25), y1, random(x1 - 25, x1 + 25), y1 - 500, 450)
    sleep(dtime)
}