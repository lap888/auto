"ui";
/*
 * @Author: topbrids@gmail.com 
 * @Date: 2023-01-02 21:51:04 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-01-03 11:00:50
 */
let stime = 3000
let etime = 5000
let dtime = 2000
let pl_keywords = "主播好美,衣服很好,买买买,要要要,好,已下单"
let zb_name = "九儿"
let emojy = "👍,😀,😁,🤣,😂,😘,🤡,🤠,😜,😝,🤑,🤓,😎,🤗,😳,😏,😶,😤,😖,😯,🤥,💤,🍑,🍅,🍉,🍇,🍖,🍤,🍳,❤️"
let storage = {}
let countR = {}

pl_keywords = pl_keywords.split(',')
emojy = emojy.split(',')

// toastLog("抖音直播评论脚本启动");
// home()

// sleep(1000)

// launchApp("抖音")
// sleep(5000)

/********************************************UI部分***********************************************/
ui.layout(
    <vertical padding="15">
        <img h="150" w="auto" src="http://docs.aiduoyou.com/server/index.php?s=/api/attachment/visitFile/sign/a084634a88648dcb76f503aa6913e0a2" />
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="操作间隔:" />
            <input id="dtime" inputType="number" gravity="center" w="80" text="1500" />
            <text textSize="15sp" textColor="black" text=" 毫秒 " />
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
        toastLog(pl_keywords)
        pl_keywords = pl_keywords.split(',')

        zb_name = ui.run_Au.getText().toString()

        storage = storages.create("topbrids@" + zb_name);
        let _countR = storage.get("count")
        toastLog("初次启动|_countR" + _countR)
        if (_countR != undefined) {
            countR = JSON.parse(_countR)
        }
        dtime = parseInt(ui.dtime.getText());
        console.toastLog('操作间隔：' + dtime / 1000 + '秒')
        main();
    });
    // try {

    // } catch {
    //     toastLog("请关掉脚本重新启动")
    // }

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
    console.toastLog("启动抖音");
    if (!launchApp("抖音")) {
        toastLog("找不到抖音App")
        return;
    }
    while (id("com.ss.android.ugc.aweme:id/ovn").exists()) {
        console.toastLog("等待加载出主页");
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
    while (true) {
        //查询评论框是否存在
        if (!find_click_ui('com.ss.android.ugc.aweme:id/e1v', false)) {
            //发送按钮是否存在
            if (find_click_ui('com.ss.android.ugc.aweme:id/t-q', false)) {
                let _pl_btn = className('android.widget.EditText')
                if (!_pl_btn.exists()) {
                    toastLog('::评论框不存在')
                } else {
                    pl_btn = _pl_btn.depth(1).indexInParent(1).visibleToUser().findOnce()
                    pl_btn.setText('来了')
                    sleep(stime)
                    find_click_ui('com.ss.android.ugc.aweme:id/t-q', true)
                }
            } else {
                toastLog('::当前不在直播界面')
            }
            delay(2)
            continue;
        }
        toastLog('::点击评论框')
        find_click_ui('com.ss.android.ugc.aweme:id/e1v', true)
        sleep(stime)
        toastLog('::写入评论文字')
        //评论文字
        let _pl_btn = className('android.widget.EditText')
        if (!_pl_btn.exists()) {
            toastLog('::评论框不存在')
            delay(2)
            continue;
        }
        pl_btn = _pl_btn.depth(1).indexInParent(1).visibleToUser().findOnce()
        let pl_text = pl_keywords[Math.floor(Math.random() * pl_keywords.length)]
        let emojy_text = emojy[Math.floor(Math.random() * emojy.length)]
        pl_text = pl_text + emojy_text
        if (countR[pl_text] == undefined) {
            countR[pl_text] = 1
        } else {
            countR[pl_text] = countR[pl_text] + 1
        }
        //持久化保存记录
        storage.put("count", JSON.stringify(countR));
        pl_text = pl_text + "X" + countR[pl_text]
        if (pl_btn == null || pl_btn == undefined) {
            toastLog('::输入框不存在')
            delay(2)
            continue;
        }
        pl_btn.setText(pl_text)
        sleep(stime)
        toastLog('::发送评论文字')
        //点击发送
        find_click_ui('com.ss.android.ugc.aweme:id/t-q', true)
        let s = random(dtime, dtime + 2000)
        sleep(s)
        if (exitFlag) { break }
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