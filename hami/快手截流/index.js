// "ui";
/* 快手脚本 直播间引流 红米K50
 * @Author: topbrids@gmail.com 
 * @Date: 2023-02-22 21:27:33 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-05-17 23:44:42
 */
const { myPhone, sleepTime, myIsgz, myDzOrGz } = hamibot.env;
let window;
let thread1 = null;
let thread2 = null;
let h = device.height;
let w = device.width;
let textLog = ""
let likeErrorCount = 0
let proId = '1006'
let androidId = device.getAndroidId();
let dzCount = 0
let oldName = ''
let hRate = 0.901223
if (myPhone == '小米8') {
    hRate = 0.861
}
if (myPhone == '华为p30Pro') {
    hRate = 0.931
}
if (myPhone == '小米9') {
    hRate = 0.911
}
if (myPhone == '小米2') {
    hRate = 0.861
}
if (myPhone == 'OPPOa93') {
    hRate = 0.905
}
if (myPhone == 'OPPOa83') {
    hRate = 0.858
}

if (myPhone == '兼容1') {
    hRate = 0.931
}
if (myPhone == '兼容2') {
    hRate = 0.921
}
if (myPhone == '兼容3') {
    hRate = 0.911
}
if (myPhone == '兼容4') {
    hRate = 0.901
}
if (myPhone == '兼容5') {
    hRate = 0.891
}
if (myPhone == '兼容6') {
    hRate = 0.881
}
if (myPhone == '兼容7') {
    hRate = 0.881
}
if (myPhone == '兼容8') {
    hRate = 0.871
}
if (myPhone == '兼容9') {
    hRate = 0.861
}
if (myPhone == '兼容10') {
    hRate = 0.851
}
if (myPhone == '兼容11') {
    hRate = 0.841
}
if (myPhone == '兼容12') {
    hRate = 0.831
}

mylog('运行设备:' + myPhone)
// setScreenMetrics(w, h)
//测试
// let names = id("com.smile.gifmaker:id/live_profile_user_name").exists()
// let uname = id("com.smile.gifmaker:id/live_profile_user_name").findOnce()
// mylog('name' + names)
// mylog('uname' + uname)
core()
function core() {
    show()
    thread2 = threads.start(function () {
        let count = 0
        while (true) {
            let liveClose = id('com.smile.gifmaker:id/live_close_place_holder').exists()
            let count0 = 0
            while (!liveClose) {
                while (id("com.smile.gifmaker:id/live_audience_new_profile_follow_status_view_container").exists() || id("com.smile.gifmaker:id/live_profile_user_name").exists() || id("com.smile.gifmaker:id/live_profile_admin_layout").exists()) {
                    back()
                    sleep(random(1000, 1500))
                }
                mylog('等待进入直播间:' + count0)
                count0++
                sleep(random(1000, 1500))
                liveClose = id('com.smile.gifmaker:id/live_close_place_holder').exists()
                continue;
            }
            mylog('点击刚进入直播间用户:' + count)
            count++

            // 0.865
            click(w * 0.215613, h * hRate);
            sleep(random(1500, 2500))

            if (!id("com.smile.gifmaker:id/live_profile_user_name").exists()) {
                mylog('用户姓名没发现...')
                sleep(random(1000, 1500))
                continue;
            }
            let uname = id("com.smile.gifmaker:id/live_profile_user_name").findOne()

            let zpCount = 0;
            if (id("com.smile.gifmaker:id/live_profile_statistics_info_group_3_number_view").exists()) {
                zpCount = id("com.smile.gifmaker:id/live_profile_statistics_info_group_3_number_view").findOne().text()
                mylog('作品数量:' + zpCount)
            }
            //关注按钮是否存在
            if (!id("com.smile.gifmaker:id/live_audience_new_profile_follow_status_view_container").exists()) {
                back()
                sleep(random(1000, 1500))
                continue;
            }
            //调用远程查询是否关注
            let dz = -1;
            //远端记录
            let findDz2Res = RemoteFindClick(uname.text())
            if (findDz2Res == '') {
                mylog('网络异常...')
                sleep(random(1000, 1500))
                continue;
            }
            if (findDz2Res.code == 200) {
                if (findDz2Res.data == 1) {
                    dz = 1
                    mylog(uname.text() + ',曾经已关注...')
                    sleep(random(1500, 2000))
                }
                dzCount = findDz2Res.nowTotal == undefined ? 0 : findDz2Res.nowTotal
            }

            let ismyIsgz = false;
            if (myIsgz == '是') {
                ismyIsgz = true
            } else {
                if (Number(zpCount) > 0) {
                    ismyIsgz = true
                }
            }
            if (uname != null && ismyIsgz) {
                if (id('com.smile.gifmaker:id/live_audience_new_profile_follow_status_view_v2').exists()) {
                    let likeBtnText = id('com.smile.gifmaker:id/live_audience_new_profile_follow_status_view_v2').findOne().text()
                    mylog('给用户:' + uname.text() + ',' + likeBtnText)
                    if (dz == -1 && likeBtnText == '关注') {
                        id("com.smile.gifmaker:id/live_audience_new_profile_follow_status_view_container").findOne().click()
                        if (dz == -1) {
                            RemoteAddClick(uname.text(), 0)
                        }
                    }
                    sleep(random(1500, 2500))
                }
            }
            while (id("com.smile.gifmaker:id/live_audience_new_profile_follow_status_view_container").exists() || id("com.smile.gifmaker:id/live_profile_user_name").exists()) {
                let likeBtnText = id('com.smile.gifmaker:id/live_audience_new_profile_follow_status_view_v2').findOne().text()
                if (likeBtnText == '关注') {
                    mylog(uname.text() + ',作品数量:' + zpCount)
                    if (oldName != uname.text()) {
                        oldName = uname.text()
                        likeErrorCount++
                    }
                } else {
                    likeErrorCount = 0
                    mylog(uname.text() + ',关注完成')
                    //点赞时间间隔
                    mylog('休息' + sleepTime + '秒,' + '已关注:' + dzCount)
                    sleep(sleepTime * 1000)
                }
                back()
                sleep(random(1000, 1500))
            }
            if (likeErrorCount > 10) {
                alert('提示', '连续10次关注失败...')
            }
        }
    })
}

/**
 * 远程查询点赞
 * @param {} name 
 * @returns 
 */
function RemoteFindClick(name) {
    try {
        let findDz2Url = 'http://101.32.178.79:30019/api/findDz2?dzName=' + name + '&channel=' + androidId + '&proId=' + proId
        let findDz2Res = http.get(findDz2Url);
        findDz2Res = findDz2Res.body.json()
        return findDz2Res;
    } catch (error) {
        console.error('RemoteFindClick,Error=>', error)
        return ''
    }
}
/**
 * 远端记录点赞
 * @param {*} name 
 * @param {*} isSph 
 */
function RemoteAddClick(name, isSph) {
    try {
        let addDz2Url = 'http://101.32.178.79:30019/api/addDz2?dzName=' + name + '&channel=' + androidId + '&proId=' + proId + '&isSph=' + isSph
        http.get(addDz2Url);
    } catch (error) {
        console.error('RemoteAddClick,Error=>', error)
    }
}

function show() {
    mylog('::选作品脚本启动')
    thread1 = threads.start(function () {
        window = floaty.rawWindow(
            <frame w='*' h='*' gravity='center' bg="#000000" alpha="0.5">
                <text padding='10 5 10 5' id='textLog' textColor="#ffffff" textSize="15sp" />
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
    textLog = text
    log(text)
}