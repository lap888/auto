"ui";

/* 微信视频号点赞
 * @Author: topbrids@gmail.com 
 * @Date: 2023-01-05 08:51:58 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-05-17 23:43:11
 */

let sub_log = true;
let h = device.height;
let w = device.width;

let nowName = ''
let oldName = ''
let dtime = 1500
let dzCount = 0
let dzCountTotal = 200
let sName = '小师妹6166'
let proId = ''
let exitFlag = false;
let storage = null;


/********************************************UI部分***********************************************/
ui.layout(
    <vertical padding="15">
        <img h="150" w="auto" src="http://docs.aiduoyou.com/server/index.php?s=/api/attachment/visitFile/sign/a084634a88648dcb76f503aa6913e0a2" />
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="项目ID:" />
            <input id="run_Pro" inputType="text" gravity="left" w="*" text="1001" />
        </horizontal>
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="视频号名称:" />
            <input id="run_Au" inputType="text" gravity="left" w="*" text="遥远的救世主" />
        </horizontal>
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="操作间隔:" />
            <input id="dtime" inputType="number" gravity="center" w="80" text="2" />
            <text textSize="15sp" textColor="black" text=" 秒 " />
        </horizontal>
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="点赞次数:" />
            <input id="dzNum" inputType="number" gravity="center" w="80" text="12" />
            <text textSize="15sp" textColor="black" text=" 次 " />
        </horizontal>
        {/* <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="评论文本:" />
            <input id="run_PL" inputType="textMultiLine" gravity="left" w="*" text="蛋哥呢,主播好" />
        </horizontal> */}

        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="about" text="使用说明" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="customize" h="50" text="开始运行" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="stop" h="50" text="停止运行" />
        <text text="" />
        <text gravity="center" textSize="15sp" textColor="red" text="作者:微信wkc19891" />
        <text text="" />
        <text gravity="center" textSize="12sp" text="视频号评论点赞助手 ver 1.0 " />
    </vertical>
);

let thread = null;

init();

ui.customize.click(function () {
    if (thread != null && thread.isAlive()) {
        alert("注意", "脚本正在运行，请结束之前进程");
        return;
    }
    log("脚本开始自定义运行");
    thread = threads.start(function () {
        sName = ui.run_Au.getText().toString();
        dzCountTotal = ui.dzNum.getText().toString();
        proId = ui.run_Pro.getText().toString();
        let date = DateFormat()
        storage = storages.create('topbrids@gmail.com' + '-' + date + "-" + proId);
        dtime = parseInt(ui.dtime.getText()) * 1000;
        log('操作间隔：' + dtime / 1000 + '秒' + sName + dzCountTotal + '次')
        exitFlag = false;
        main();
    });

});

ui.stop.click(function () {
    if (thread != null && thread.isAlive()) {
        threads.shutDownAll();
        toastLog("停止运行！")
    }
    else {
        toastLog("没有线程在运行！")
    }
    exitFlag = true
});

ui.about.click(function () {
    auto()
    alert("使用说明",
        "● 程序需要悬浮窗和无障碍权限\n（设置→辅助功能→无障碍→本 APP）\n ● 程序工作原理为模拟点击，基于Auto.js框架+JavaScript脚本执行，部分手机可能不支持\n ● 请确保进入 抖音 且位于 要进行评论的直播间 \n ● 安卓版本低于安卓7，部分功能可能无法执行 \n ● 测试机型：Redmi k50，Android 12，MiUI 13稳定版 \n"
    )
});

function main() {
    // auto.waitFor();//等待获取无障碍辅助权限
    auto()
    log('微信点赞脚本启动')
    exitFlag = false
    dz()
    threads.shutDownAll();
    engines.stopAll();
    exit();
}
function dz() {
    console.show();
    while (true) {
        sleep(dtime)
        if (exitFlag) {
            log('::主动退出脚本 点赞' + sName + '次数' + dzCount)
            break
        }
        let sps = id('com.tencent.mm:id/i5j').visibleToUser().find()
        log("主页视频个数|" + sps.length)
        if (sps.length > 1) {
            let tmp = sps[1].bounds()
            click(tmp.centerX(), tmp.centerY())
            sleep(random(2000, 3000))
            //大视频
            while (dzCount < dzCountTotal) {
                sleep(random(dtime, dtime + 1000))
                if (exitFlag) {
                    log('::主动退出脚本 点赞' + sName + '次数' + dzCount)
                    break
                }
                //第一条评论点赞
                while (dzCount < dzCountTotal) {
                    if (exitFlag) {
                        log('::主动退出脚本 点赞' + sName + '次数' + dzCount)
                        break
                    }
                    find_click_ui('com.tencent.mm:id/bjq', true)
                    sleep(3000)
                    let pls = id('com.tencent.mm:id/lwb').visibleToUser().find()

                    let names = id('com.tencent.mm:id/hft').visibleToUser().find()
                    if (names[0] == undefined) {
                        sleep(1000)
                        continue
                    }
                    nowName = names[0].text()

                    log('nowName' + nowName)
                    let oldDz = storage.get('dz')
                    if (oldDz == undefined) {
                        oldDz = []
                    } else {
                        oldDz = JSON.parse(oldDz)
                    }
                    let line = className('android.widget.LinearLayout').depth(3).drawingOrder(2).indexInParent(1).visibleToUser();
                    if (line.exists()) {
                        pls.forEach((v, i) => {
                            if (i > 1) {
                                let tmp_n = pls[i - 1].bounds()
                                if (nowName == sName) {
                                    log('::作者评论不点赞')
                                } else {
                                    nowName = names[i].text()
                                    let dz = oldDz.findIndex(v => v.name == nowName)
                                    if (dz == -1) {
                                        click(tmp_n.centerX(), tmp_n.centerY())
                                        dzCount++
                                        oldDz.push({ name: nowName })
                                        storage.put('dz', JSON.stringify(oldDz))
                                        oldName = nowName
                                    } else {
                                        log('::今日' + nowName + '已点赞,本次不点')
                                    }
                                }
                                sleep(2000)
                            }
                        });
                        oldName = nowName = ''
                        log('::评论滑动出现下划线，到底跳出')
                        back()
                        break;
                    } else {
                        log("::当前页评论条数|" + pls.length + "|" + nowName)
                        if (pls[0] != undefined) {
                            let tmp_n = pls[0].bounds()
                            if (nowName == sName) {
                                log('::作者评论不点赞')
                            } else {
                                let dz = oldDz.findIndex(v => v.name == nowName)
                                log(nowName + 'dz' + dz)
                                if (dz == -1) {
                                    click(tmp_n.centerX(), tmp_n.centerY())
                                    dzCount++
                                    oldDz.push({ name: nowName })
                                    storage.put('dz', JSON.stringify(oldDz))
                                } else {
                                    log('::今日' + nowName + '已点赞,本次不点')
                                }
                            }
                            oldName = nowName
                            sleep(1000)
                            i_move(w / 2, h * 0.85)
                        } else {
                            log('::未获取到评论')
                            back()
                            break;
                        }
                    }
                    log('::点赞第' + dzCount + '次')
                }
                sleep(3000)
                //滑动下一个视频
                h_move(w / 2, h * 0.8, w / 2, h * 0.1)
                sleep(2000)
                //判断到底是否
                let line2 = className('android.widget.LinearLayout').depth(2).drawingOrder(2).indexInParent(4).visibleToUser();
                if (line2.exists()) {
                    log('::大视频滑动出现下划线，到底跳出')
                    back()
                    sleep(2000)
                    back()
                    break;
                }
            }
        } else {
            log('::没有找到主页视频')
        }
        if (dzCount >= dzCountTotal) {
            log('::点赞完成')
            break;
        }
    }
}

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

function init() {
    importClass(com.stardust.autojs.core.accessibility.AccessibilityBridge.WindowFilter);
    let bridge = runtime.accessibilityBridge;
    let bridgeField = runtime.getClass().getDeclaredField("accessibilityBridge");
    let configField = bridgeField.getType().getDeclaredField("mConfig");
    configField.setAccessible(true);
    configField.set(bridge, configField.getType().newInstance());
    bridge.setWindowFilter(new JavaAdapter(AccessibilityBridge$WindowFilter, {
        filter: function (info) {
            return true;
        }
    }));
}