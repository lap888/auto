"ui";
/* keep  社区
 * @Author: topbrids@gmail.com 
 * @Date: 2023-02-09 16:48:38 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-02-10 14:49:05
 */
let window;
let sub_log = true
let h = device.height;
let w = device.width;
let proId = '1002'
let androidId = device.getAndroidId();
let dzCount = 0
let totalDz = 500
let theSameClick = 0
let exitFlag = false;
let storage = null;
let launchAppName = "Keep"

ui.layout(
    <vertical padding="15">
        <img h="150" w="auto" src="http://docs.aiduoyou.com/server/index.php?s=/api/attachment/visitFile/sign/a084634a88648dcb76f503aa6913e0a2" />
        <horizontal marginTop="10sp">
            <text marginLeft="6" textSize="15sp" textColor="black" text="项目ID:" />
            <text marginLeft="6" id="run_Pro" textSize="15sp" gravity="left" w="*" textColor="black" />
        </horizontal>
        <horizontal marginTop="10sp">
            <text marginLeft="6" textSize="15sp" textColor="black" text="设备ID:" />
            <text marginLeft="6" id="d_ID" textSize="15sp" gravity="left" w="*" textColor="black" />
        </horizontal>
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="打开APP名称:" />
            <input id="launchAppName" inputType="text" gravity="left" w="*" text="Keep" />
        </horizontal>
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="点赞次数:" />
            <input id="dzNum" inputType="number" gravity="center" w="80" text="10" />
            <text textSize="15sp" textColor="black" text=" 次 " />
        </horizontal>

        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="about" text="使用说明" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="customize" h="50" text="开始运行" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="stop" h="50" text="停止运行" />

        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="mylog" h="50" text="日志" />
        <text text="" />
        <text gravity="center" textSize="15sp" textColor="red" text="作者:微信wkc19891" />
        <text text="" />
        <text gravity="center" textSize="12sp" text="KEEP留痕助手 ver 1.0 " />
    </vertical>
);

let thread = null;


ui.d_ID.setText(androidId);
ui.run_Pro.setText(proId);
let kk = 'topbrids@gmail.com' + "-" + proId
storage = storages.create(kk);

let dzC = storage.get('dz-count')
if (dzC != undefined) {
    totalDz = dzC
    ui.dzNum.setText(totalDz);
    log('totalDz,缓存参数：', dzC)
}
let _launchAppName = storage.get('launchAppName')
if (_launchAppName != undefined) {
    launchAppName = _launchAppName
    ui.launchAppName.setText(launchAppName);
    log('launchAppName,缓存参数：', launchAppName)
}
ui.customize.click(function () {
    if (thread != null && thread.isAlive()) {
        alert("注意", "脚本正在运行，请结束之前进程");
        return;
    }
    log("::脚本开始自定义运行");
    thread = threads.start(function () {
        totalDz = ui.dzNum.getText().toString();
        storage.put('dz-count', totalDz)
        launchAppName = ui.launchAppName.getText().toString();
        storage.put('launchAppName', launchAppName)
        exitFlag = false;
        let res = RemoteFindClick('', 1)
        if (res.code == 200) {
            dzCount = res.nowTotal == undefined ? 0 : res.nowTotal
            log('::远端获取点赞次数', dzCount)
        }
        main()
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
        "● 程序需要悬浮窗和无障碍权限\n（设置→辅助功能→无障碍→本 APP）\n ● 程序工作原理为模拟点击，基于Auto.js框架+JavaScript脚本执行，部分手机可能不支持\n ● 请确保进入 抖音 且位于 要进行评论的直播间 \n ● 安卓版本低于安卓7，部分功能可能无法执行 \n ● 测试机型：Redmi k50，Android 12，MiUI 13稳定版 \n点赞次数设置为0则为无限点赞"
    )
});

ui.mylog.click(function () {
    app.startActivity("console");
});

/** 
 * @description: 启动app
 * @param: null
 * @return: null
 */
function StartApp() {
    log("::启动" + launchAppName);
    if (!launchApp(launchAppName)) {
        console.error("::找不到微信!");
        return;
    }

    while (!id("tabText").className("android.widget.TextView").text("社区").exists()) {
        log("::等待加载出主页社区");
        sleep(1000)
        continue;
    }
    sleep(1000)
    id("tabText").className("android.widget.TextView").text("社区").findOne().parent().parent().click()
    log('::点击社区')
}

function main() {
    auto.waitFor();//等待获取无障碍辅助权限
    exitFlag = false
    core()
    threads.shutDownAll();
    engines.stopAll();
    exit();
}
/**
 * 核心业余逻辑
 */
function core() {
    StartApp()
    while (true) {
        let plIds = id("com.gotokeep.keep:id/item_community_comment_text").find()
        if (plIds.length > 0) {
            let fridstPl = plIds[0].text()
            if (fridstPl != '' && fridstPl != undefined) {
                //点击进入评论
                plIds[0].parent().click()
                sleep(random(2200, 3500))
                //点击收起1
                let close1 = id("com.gotokeep.keep:id/textClose")
                while (close1.exists()) {
                    log('::检查是否关闭收起')
                    // back()
                    close1.visibleToUser().findOnce().click()
                    sleep(random(1500, 2300))
                    close1 = id("com.gotokeep.keep:id/textClose")
                    continue;
                }
                let name = id("com.gotokeep.keep:id/textUsername").visibleToUser().findOnce()
                //点击弹出2
                id("com.gotokeep.keep:id/containerComment").findOne().click()
                sleep(random(2200, 3500))
                //查出其姓名
                // let name = //plIds[0].parent().parent().parent().findOne(id('com.gotokeep.keep:id/fellowShipName'))
                if (name == null) {
                    log('未发现up主name')
                    //返回到社区主页继续滑动
                    let close = id("com.gotokeep.keep:id/textClose")
                    while (close.exists()) {
                        log('::检查评论是否关闭')
                        close.visibleToUser().findOnce().click()
                        // back()
                        sleep(random(2200, 3300))
                        close = id("com.gotokeep.keep:id/textClose")
                        continue;
                    }
                    let share = id("com.gotokeep.keep:id/imgBack")
                    while (share.exists()) {
                        log('::检查详情页是否返回')
                        back()
                        sleep(random(2200, 3300))
                        share = id("com.gotokeep.keep:id/imgBack")
                        continue;
                    }
                    h_move(w / 2, h * 0.8, w / 2, h * 0.1)
                    continue;
                }
                name = name.text()
                log('up主=', name, '评论条数=', fridstPl)
                //循环滑动
                while (true) {
                    let isLast = false;
                    if (text("- 没有更多内容 -").exists()) {
                        isLast = true
                        log('没有更多内容')
                    }
                    if (theSameClick > 5) {
                        theSameClick = 0
                        isLast = true
                        log('滑动多次见底')
                    }
                    //滑动评论点赞
                    let nPlIds = id("com.gotokeep.keep:id/imgLike").find()
                    if (nPlIds.length > 0) {
                        if (isLast) {
                            nPlIds.forEach(like => {
                                if (like != null && like != undefined && like.parent() != null) {
                                    let name1 = like.parent().findOne(id("com.gotokeep.keep:id/textUsername"))
                                    if (name1 != null) {
                                        name1 = name1.text()
                                        //去重远程点赞统计
                                        let findDz2Res = RemoteFindClick(name1)
                                        let dz = -1;
                                        if (findDz2Res.code == 200) {
                                            if (findDz2Res.data == 1) {
                                                dz = 1
                                            }
                                            dzCount = findDz2Res.nowTotal == undefined ? 0 : findDz2Res.nowTotal
                                        }
                                        if (dz == -1) {
                                            if (name1 != name) {
                                                log('被点赞人姓名=', name1, '点赞次数=', dzCount)
                                                //点赞非作者
                                                let tmp_n_p = like.bounds()
                                                click(tmp_n_p.centerX(), tmp_n_p.centerY())
                                                RemoteAddClick(name1, 0)
                                            }
                                            sleep(random(2200, 3500))
                                        } else {
                                            log('已点赞=', name1, '点赞次数=', dzCount)
                                            sleep(random(1200, 1500))
                                        }
                                    }
                                }
                            });
                            break;
                        } else {
                            let like = nPlIds[0]
                            let name1 = like.parent().findOne(id("com.gotokeep.keep:id/textUsername"))
                            if (name1 != null) {
                                name1 = name1.text()
                                //去重远程点赞统计
                                let findDz2Res = RemoteFindClick(name1)
                                let dz = -1;
                                if (findDz2Res.code == 200) {
                                    if (findDz2Res.data == 1) {
                                        dz = 1
                                    }
                                    dzCount = findDz2Res.nowTotal == undefined ? 0 : findDz2Res.nowTotal
                                }
                                if (dz == -1) {
                                    if (name1 != name) {
                                        theSameClick = 0
                                        log('被点赞人姓名=', name1, '点赞次数=', dzCount)
                                        //点赞非作者
                                        let tmp_n_p = like.bounds()
                                        click(tmp_n_p.centerX(), tmp_n_p.centerY())
                                        RemoteAddClick(name1, 0)
                                    }
                                } else {
                                    theSameClick++
                                    log('已点赞=', name1, '点赞次数=', dzCount)
                                }
                            }
                        }
                        let close2 = id("com.gotokeep.keep:id/textClose")
                        if (close2.exists()) {
                            //滑动
                            i_move(w / 2, h * 0.85)
                        } else {
                            log('收起不存在,结构破坏,返回社区')
                            break;
                        }

                    } else {
                        log('获取评论条数失败,条数:', nPlIds.length, '条')
                        break;
                    }

                    if (dzCount > totalDz) {
                        log('点赞任务完成,点赞:', totalDz, '次')
                        break;
                    }
                    if (exitFlag) {
                        log('::主动退出脚本,点赞:', dzCount, '次')
                        break
                    }
                }
                //返回到社区主页继续滑动
                let close = id("com.gotokeep.keep:id/textClose")
                while (close.exists()) {
                    log('::检查评论是否关闭')
                    close.visibleToUser().findOnce().click()
                    // back()
                    sleep(random(2200, 3300))
                    close = id("com.gotokeep.keep:id/textClose")
                    continue;
                }
                let share = id("com.gotokeep.keep:id/imgBack")
                while (share.exists()) {
                    log('::检查详情页是否返回')
                    back()
                    sleep(random(2200, 3300))
                    share = id("com.gotokeep.keep:id/imgBack")
                    continue;
                }
                //大页滑动
                h_move(w / 2, h * 0.8, w / 2, h * 0.1)
            } else {
                h_move(w / 2, h * 0.8, w / 2, h * 0.1)
            }
        } else {
            h_move(w / 2, h * 0.8, w / 2, h * 0.1)
        }
        if (dzCount > totalDz) {
            log('点赞任务完成')
            // break;
            alert("提示", "点赞任务完成")
        }
        if (exitFlag) {
            log('::主动退出脚本,点赞:', dzCount, '次')
            break
        }
    }
}

function h_move(x1, y1, x2, y2) {
    if (sub_log) { log('::大页滑动屏幕') }
    swipe(random(x1 - 25, x1 + 25), random(y1 - 25, y1 + 25), random(x2 - 25, x2 + 25), random(y2 - 25, y2 + 25), random(400, 500))
    sleep(random(2200, 3500))
}

function i_move(x1, y1) {
    if (sub_log) { log('::评论滑动屏幕') }
    y1 = random(y1 - 10, y1 + 10)
    swipe(random(x1 - 25, x1 + 25), y1, random(x1 - 25, x1 + 25), y1 - 250, 500)
    sleep(random(2200, 3500))
}
/**
 * 远程查询点赞
 * @param {} name 
 * @returns 
 */
function RemoteFindClick(name) {
    let findDz2Url = 'http://101.32.178.79:30019/api/findDz2?dzName=' + name + '&channel=' + androidId + '&proId=' + proId
    let findDz2Res = http.get(findDz2Url);
    findDz2Res = findDz2Res.body.json()
    return findDz2Res;
}
/**
 * 远端记录点赞
 * @param {*} name 
 * @param {*} isSph 
 */
function RemoteAddClick(name, isSph) {
    let addDz2Url = 'http://101.32.178.79:30019/api/addDz2?dzName=' + name + '&channel=' + androidId + '&proId=' + proId + '&isSph=' + isSph
    http.get(addDz2Url);
}