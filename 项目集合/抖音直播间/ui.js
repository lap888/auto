"ui";
/*
 * @Author: topbrids@gmail.com 
 * @Date: 2023-01-02 21:51:04 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-05-21 00:50:17
 */
let stime = 1000
let etime = 2000
let dtime = 2000
let lookCountTotal = 0
let pl_keywords = ",衣服很好,买买买,要要要,好,已下单"
pl_keywords = pl_keywords.split(',')
let zb_name = "九儿"
let sub_log = true
let dts = null
let dts2 = null
let postList = ['主播好', '要要要', '喜欢主播的点点关注', '已下单', '买买买', '真不错~', '加油~', '不错哟~', 'nice', '支持,上个热门~', '支持一个~', '厉害了~', '过来看看~']

let storage = {}
let countR = {}
let emojy = "👍,😘,🤡,🤠,🍑,🍅,🍉,❤️,🍎,🍊,🍋,🍌,🍉,🍅,🥑,🥝,🍍,🍑,🍒,🍈,🍓,🍖,🍔,🍟,🌭,🍕,🍣,🍿,🍩,🍪,🥛,🍺,🍻,🍷,🍸,🍹,🥂"
emojy = emojy.split(',')




/********************************************UI部分***********************************************/
ui.layout(
    <vertical padding="15">
        <img h="150" w="auto" src="http://docs.aiduoyou.com/server/index.php?s=/api/attachment/visitFile/sign/a084634a88648dcb76f503aa6913e0a2" />
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="操作间隔:" />
            <input id="dtime" inputType="number" gravity="center" w="80" text="12" />
            <text textSize="15sp" textColor="black" text=" 秒 " />
        </horizontal>

        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="评论文本:" />
            <input id="run_PL" inputType="textMultiLine" gravity="left" w="*" text="蛋哥呢,主播好" />
        </horizontal>
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="直播间名称:" />
            <input id="run_Au" inputType="text" gravity="left" w="*" text="遥远的女孩" />
        </horizontal>
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="about" text="使用说明" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="customize" h="50" text="开始运行" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="stop" h="50" text="停止运行" />
        <text text="" />
        <text gravity="center" textSize="15sp" textColor="red" text="作者:微信wkc19891" />
        <text text="" />
        <text gravity="center" textSize="12sp" text="抖音直播助手 ver 1.0 " />
    </vertical>
);

let thread = null;

ui.customize.click(function () {
    if (thread != null && thread.isAlive()) {
        alert("注意", "脚本正在运行，请结束之前进程");
        return;
    }
    toast("开始自定义运行");
    thread = threads.start(function () {
        pl_keywords = ui.run_PL.getText().toString();
        pl_keywords = pl_keywords.split(',')
        zb_name = ui.run_Au.getText().toString()
        storage = storages.create("topbrids@" + zb_name);
        let _countR = storage.get("count")
        if (_countR != undefined && _countR != '' && _countR != null) {
            countR = JSON.parse(_countR)
        }
        dtime = parseInt(ui.dtime.getText()) * 1000;
        toastLog('操作间隔：' + dtime / 1000 + '秒')
        main();
    });

});

ui.stop.click(function () {
    if (thread != null && thread.isAlive()) {
        threads.shutDownAll();
        toast("停止运行！")
    }
    else {
        toast("没有线程在运行！")
    }
    exitFlag = true
});

ui.about.click(function () {
    auto()
    alert("使用说明",
        "● 程序需要悬浮窗和无障碍权限\n（设置→辅助功能→无障碍→本 APP）\n ● 程序工作原理为模拟点击，基于Auto.js框架+JavaScript脚本执行，部分手机可能不支持\n ● 请确保进入 抖音 且位于 要进行评论的直播间 \n ● 安卓版本低于安卓7，部分功能可能无法执行 \n ● 测试机型：Redmi k50，Android 12，MiUI 13稳定版 \n"
    )
});

function start_app() {
    toastLog("启动抖音");
    if (!launchApp("抖音")) {
        toastLog("找不到抖音App")
        return;
    }
    while (id("com.ss.android.ugc.aweme:id/ovn").exists()) {
        toastLog("等待加载出主页");
        delay(1);
        continue;
    }
    delay(1);
}

function main() {
    auto.waitFor();//等待获取无障碍辅助权限
    init()
    delay(1)
    start_app();//启动app
    exitFlag = false
    dz()
    threads.shutDownAll();
    engines.stopAll();
    exit();
}
function dz() {
    // console.show()
    while (true) {
        let cy = text('立即参与').visibleToUser().findOnce()
        if (cy) {
            sleep(1000)
            cy.click()
            sleep(1000)
        }
        //检查是否有讲解商品
        // descContains(str)
        let isLl = false;
        if (dts2 == null || Date.now() - dts2 > 60 * 1000) {
            dts2 = Date.now()
            let jj_btn = descContains("主播讲解中").visibleToUser().findOnce()
            let lookCount = 0;

            sleep(1000)
            if (jj_btn) {
                toastLog('::进入讲解商品')
                isLl = true
                jj_btn.click()
                let dt1 = Date.now()
                while (Date.now() - dt1 <= 20 * 1000) {
                    i_move(600, device.height * 0.85)
                    lookCount++
                    log('::进入讲解商品' + lookCount)
                    sleep(1000)
                }
                lookCountTotal++
                toastLog('::浏览讲解商品完毕' + lookCountTotal)
                back()
                sleep(random(1000, 2000))
            }
        }

        let plText = id('com.ss.android.ugc.aweme:id/text').visibleToUser().find()
        let plText2 = ''
        if (plText.length > 2) {
            // let plCount = plText.length
            let text1 = plText[0].text().split('：')[1]
            let text2 = plText[1].text().split('：')[1]
            if (text1 != undefined) {
                let reg = /[0-9]+/g;
                text1 = text1.replace(reg, "");
            } else {
                text1 = ''
            }
            if (text2 != undefined) {
                let reg = /[0-9]+/g;
                text2 = text2.replace(reg, "");
            } else {
                text2 = ''
            }
            plText2 = text1 + " , " + text2
        }
        let rsNum = random(dtime, dtime + 6000)
        if (dts == null || Date.now() - dts > rsNum) {

            // //查询底部评论框是否存在
            if (find_click_ui('com.ss.android.ugc.aweme:id/e1v', true)) {
                toastLog('::点击底部评论框')
                sleep(random(stime, etime))
                let pl_text = pl_keywords[Math.floor(Math.random() * pl_keywords.length)]
                let pl_text2 = postList[Math.floor(Math.random() * postList.length)]
                pl_text = pl_text + "，" + pl_text2
                //抓取屏幕三条随机评论
                pl_text = pl_text + plText2
                let isLlText = pl_text2;
                let emojy_text = emojy[Math.floor(Math.random() * emojy.length)]
                //随机加表情
                let emojy_arr = Math.floor(Math.random() * 3)
                for (let i = 0; i < emojy_arr; i++) {
                    emojy_text = emojy_text + emojy[Math.floor(Math.random() * emojy.length)]
                }
                pl_text = pl_text + emojy_text
                if (countR[pl_text] == undefined) {
                    countR[pl_text] = 1
                } else {
                    countR[pl_text] = countR[pl_text] + 1
                }
                //持久化保存记录
                storage.put("count", JSON.stringify(countR));
                //组合随机文字
                pl_text = pl_text + " " + countR[pl_text]
                toastLog('::写入评论文字')
                if (isLl) {
                    setText("主播好，讲解商品已看，" + isLlText + lookCountTotal)
                } else {
                    setText(pl_text)
                }

                sleep(random(stime + 1000, etime + 1000))
                toastLog('::发送评论文字')
                //点击发送
                if (!find_click_ui('com.ss.android.ugc.aweme:id/t-q', true)) {
                    //兼容华为nova5
                    find_click_ui('com.ss.android.ugc.aweme:id/p7c', true)
                }
                dts = Date.now()

            } else {
                toastLog('::底部评论框不存在')
                setText('来了')
                sleep(random(stime, etime))
                if (!find_click_ui('com.ss.android.ugc.aweme:id/t-q', true)) {
                    if (!find_click_ui('com.ss.android.ugc.aweme:id/p7c', true)) {
                        toastLog('::当前不在直播界面')
                    }
                }
            }
        }
        // log('::循环检查')
        sleep(1000)
        if (exitFlag) { break }
    }
}


function i_move(x1, y1) {
    if (sub_log) { log('::滑动屏幕') }
    y1 = random(y1 - 10, y1 + 10)
    swipe(random(x1 - 25, x1 + 25), y1, random(x1 - 25, x1 + 25), y1 - 800, 450)
    sleep(random(1000, 2000))
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

function delay(seconds) {
    sleep(1000 * seconds);//sleep函数参数单位为毫秒所以乘1000
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