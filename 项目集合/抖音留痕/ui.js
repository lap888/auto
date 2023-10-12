"ui";

/**
 * 本地点赞
 * @Description: Auto.js 抖音助手
 * @version: 1.0
 * @Author: null119 微信公众号：治廷君
 * @Date: 2022-8-22
 */




var countNum;//执行次数
var stime = 3000
var etime = 5000
var like_Num = 0
var dtime
var exitFlag
var sub_log  //子模块日志开关
var rpost   //是否启用随机评论
var rfuocs   //是否启用随机关注
var new_fansname = ''
var old_fansname = ''
let endTime = '2023-02-08 23:59:59'
let isLocal = false;
var postList = ['真不错~', '加油~', '期待新作!', '不错哟~', '有点意思~', '挺不错，加油!', 'nice', '拍的不错哟~', '支持,上个热门~', '支持一个~', '厉害了~', '又刷到了~', '我是来看评论的~', '你来我往，我先你后~', '给你的赞可能回迟到，但不会缺席~', '常来常往哦~',
    '过来看看~']
var idList = [
    'g_',//头像下面：红色+号
    'u52',//用户信息页：粉丝数量
    'n6m',//用户信息页：关注按钮
    'mcj',//用户信息页：粉丝名称
    'tea',//用户信息页：抖音号
    'lyc',//用户信息页：用户头像
    'lj',//播放页：红心位置
    'root',//直播间控件   
    'ups',//粉丝列表Item中：粉丝名称
    'o1m',//右下侧：分享按钮
    'bge',//评论“发送”按钮
]
// fullId = com.ss.android.ugc.aweme:id/bge

/********************************************UI部分***********************************************/
ui.layout(
    <vertical padding="15">
        <img h="150" w="auto" src="http://docs.aiduoyou.com/server/index.php?s=/api/attachment/visitFile/sign/a084634a88648dcb76f503aa6913e0a2" />
        <horizontal>
            <checkbox id="chk_reply" text="开启随机评论" checked="false" />
        </horizontal>
        <horizontal>
            <checkbox id="chk_foucs" text="开启随机关注" checked="false" />
        </horizontal>
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="操作间隔:" />
            <input id="dtime" inputType="number" gravity="center" w="80" text="1500" />
            {/* <text textSize="15sp" textColor="black" text=" - " />
            <input id="stime" inputType="number" gravity="center" w="50" text="5" /> */}
            <text textSize="15sp" textColor="black" text=" 毫秒 " />
        </horizontal>
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="执行次数:" />
            <input id="run_Num" inputType="number" gravity="center" w="80" text="10" />
            <text textSize="15sp" textColor="black" text=" 次 " />
        </horizontal>
        <horizontal marginTop="10sp">
            <text marginLeft="6" textSize="15sp" textColor="black" text="到期时间:" />
            <text marginLeft="6" id="d_ID" textSize="15sp" gravity="left" w="*" textColor="black" />
        </horizontal>
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="about" text="使用说明" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="customize" h="50" text="开始运行" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="stop" h="50" text="停止运行" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="mylog" h="50" text="日志" />
        <text text="" />
        {/* <text gravity="center"  textSize="15sp" textColor="red" text="微信搜索关注公众号：治廷君" /> */}
        <text text="" />
        <text gravity="center" textSize="12sp" text="抖音涨粉助手 ver 1.0 " />
    </vertical>

);

var thread = null;
init()
ui.d_ID.setText(endTime);

ui.chk_reply.on("check", (checked) => {
    if (checked) {
        rpost = true
        console.log('rpost', rpost)
    } else {
        rpost = false
        console.log('rpost', rpost)
    }
})

ui.chk_foucs.on("check", (checked) => {
    if (checked) {
        rfuocs = true
        console.log('rfuocs', rfuocs)
    } else {
        rfuocs = false
        console.log('rfuocs', rfuocs)
    }
})

ui.customize.click(function () {
    if (thread != null && thread.isAlive()) {
        alert("注意", "脚本正在运行，请结束之前进程");
        return;
    }
    toast("开始自定义运行");
    //时间转时间戳
    let endTime1 = new Date(endTime).getTime()

    if (Date.now() > endTime1) {
        alert("注意", "脚本已到期,请联系管理员");
        return;
    }
    thread = threads.start(function () {
        countNum = parseInt(ui.run_Num.getText());
        dtime = parseInt(ui.dtime.getText());
        console.log('操作间隔：' + dtime + '秒')
        rpost = ui.chk_reply.checked;
        rfuocs = ui.chk_foucs.checked;
        console.log('自动随机评论：' + rpost)
        console.log('自动随机关注：' + rpost)
        exitFlag = false;
        console.log('抖音点赞任务数量：' + countNum.toString() + '次')
        main();
    });
});
ui.mylog.click(function () {
    app.startActivity("console");
});

ui.stop.click(function () {
    if (thread != null && thread.isAlive()) {
        threads.shutDownAll();
        toast("停止运行！")
    }
    else {
        toast("没有线程在运行！")
    }
});

ui.about.click(function () {
    auto()
    alert("使用说明",
        "● 程序需要悬浮窗和无障碍权限\n（设置→辅助功能→无障碍→本 APP）\n ● 程序工作原理为模拟点击，基于Auto.js框架+JavaScript脚本执行，部分手机可能不支持\n ● 请确保进入 抖音 且位于 主界面，模拟点击从主界面开始 \n ● 安卓版本低于安卓7，部分功能可能无法执行 \n ● 测试机型：Redmi k50，Android 12，MiUI 13稳定版 \n ● 免责声明：本程序只供个人学习Auto.js使用，不得用于违法用途，否则造成的一切后果自负！"
    )
});


function main() {
    auto.waitFor();//等待获取无障碍辅助权限
    
    sleep(1000)
    start_app();//启动app
    var start = new Date().getTime();//程序开始时间 
    exitFlag = false
    // sub_log = false
    sub_log = true
    randomlike()
    var end = new Date().getTime();
    console.log("运行结束,共耗时" + (parseInt(end - start)) / 1000 + "秒");
    threads.shutDownAll();
    engines.stopAll();
    exit();
}

/** 
 * @description: 启动app
 * @param: null
 * @return: null
 */
function start_app() {
    console.log("启动抖音");
    if (!launchApp("抖音")) {
        console.error("找不到抖音App!");
        return;
    }
    while (id("com.ss.android.ugc.aweme:id/ovn").exists()) {
        console.log("等待加载出主页");
        delay(1);
        continue;
    }
    delay(1);
}

/**
 * @description: 定义延时函数
 * @param: seconds-延迟秒数
 * @return: null
 */
function delay(seconds) {
    sleep(1000 * seconds);//sleep函数参数单位为毫秒所以乘1000
}


function randomlike() {
    log('Start...')
    //进入本地服务
    while (true) {
        // fullId = com.ss.android.ugc.aweme:id/g=c
        h_move(device.width / 2, device.height * 0.7, device.width / 2, device.height * 0.25)
        if (fork_click() == false) {
            continue
        }
        //时间转时间戳
        let endTime1 = new Date(endTime).getTime()

        if (Date.now() > endTime1) {
            alert("注意", "脚本已到期,请联系管理员");
            break;
        }
        // fans_click()
        //判断是否进入粉丝列表页
        if (chk_fansListPage()) {
            //log('::进入粉丝列表页')
            while (true) {
                //第一层级粉丝列表
                //log('::点击粉丝列表item[0]')
                fans_Listclick()//点击进入第一个粉丝

                if (chk_userPage()) {
                    log('::进入2级粉丝信息页')
                    new_fansname = get_fansName()
                    if (new_fansname != '' && old_fansname != '') {
                        if (new_fansname == old_fansname) {
                            log('::到底跳出..')
                            back()
                            sleep(dtime)
                            back()
                            sleep(dtime)
                            // back()
                            // sleep(dtime)
                            h_move(250, device.height * 0.5, 250, device.height * 0.25)
                            break
                        }
                    }
                    old_fansname = new_fansname
                    h_move(250, device.height * 0.5, 250, device.height * 0.25)
                    let tmpzp = id('com.ss.android.ugc.aweme:id/container').visibleToUser().find()
                    if (tmpzp.length > 0) {

                        log('::播放作品')
                        let tmp_n = tmpzp[random(0, tmpzp.length - 1)].bounds()
                        click(tmp_n.centerX(), tmp_n.centerY())
                        sleep(random(stime, etime))
                        lick_click()
                        //log('::自动评论')
                        if (rpost) {
                            if (random(0, 2) == 1) {
                                log('::自动评论')
                                reply()
                            }
                        }
                        back()
                        sleep(dtime)
                        //关注
                        if (random(0, 3) == 1) {
                            log('::自动关注')
                            foucs_click()
                        }
                        sleep(dtime)
                        if (like_Num >= countNum) { exitFlag = true }
                    }

                    back()
                    sleep(dtime)
                }

                i_move(500, device.height * 0.85)
                if (chk_maxDown()) {
                    log('::到底跳出')
                    back()
                    sleep(dtime)
                    back()
                    sleep(dtime)
                    h_move(250, device.height * 0.5, 250, device.height * 0.25)
                    break
                }
                if (exitFlag) {
                    log('::停止运行')
                    break
                }
            }
        } else {
            back_click()
        }
        if (exitFlag) {
            log('::停止运行')
            break
        }
    }
    home()
    sleep(2000)
    //toast('点赞留痕数：'+like_Num+' ,任务结束！')
    log('######点赞留痕数：' + like_Num + ' ,任务结束！######')
    alert('点赞留痕数：' + like_Num + ',任务结束！')
}

function back_click() {
    //点击左上角[后退按钮]位置
    let tmp_btn = desc("返回").visibleToUser().findOnce()
    if (tmp_btn) {
        if (sub_log) { log('点击“返回”按钮') }
        tmp_btn.click()
        sleep(dtime)
        return true
    } else {
        if (sub_log) { log('没有找到“返回”按钮') }
        sleep(dtime)
        back()
        return false
    }
}

function lick_click() {
    //点击右侧[红心]位置
    let tmp_btn = descStartsWith("未点赞").visibleToUser().findOnce()
    // fullId = com.ss.android.ugc.aweme:id/lj
    // fullId = com.ss.android.ugc.aweme:id/d6s
    // let tmp_btn = id("com.ss.android.ugc.aweme:id/" + idList[6]).visibleToUser().findOnce()
    //let tmp_btn=id("com.ss.android.ugc.aweme:id/dve").visibleToUser().findOnce()
    if (tmp_btn) {
        if (sub_log) { log('点击“like”按钮') }
        tmp_btn.click()
        like_Num += 1
        log('======= 点赞数：' + like_Num + ' =======')
        //toast('======= 点赞数：'+like_Num+' =======')
        sleep(dtime)
        return true
    } else {
        if (sub_log) { log('没有找到“like”按钮') }
        sleep(dtime)
        return false
    }
}

function fork_click() {
    // 点击右侧[用户头像（关注按钮）]位置

    if (find_click_ui('com.ss.android.ugc.aweme:id/user_avatar', true)) {
        sleep(stime)
        // 粉丝按钮
        // fullId = com.ss.android.ugc.aweme:id/u52
        if (find_click_ui('com.ss.android.ugc.aweme:id/u52', true)) {
            sleep(stime)
            log('::进入粉丝页')
            return true;
        } else {
            log('直播|广告,继续下一位')
            sleep(stime)
            back();
            sleep(stime)
            return false;
        }
    } else {
        log('无头像,大页直播,继续下一位')
        sleep(stime)
        return false;
    }
}

function foucs_click() {
    // fullId = com.ss.android.ugc.aweme:id/e_-
    // fullId = com.ss.android.ugc.aweme:id/n6m
    let tmp_btn = id("com.ss.android.ugc.aweme:id/" + idList[2]).visibleToUser()
    if (tmp_btn.exists()) {
        let btn_foucs_f = id("com.ss.android.ugc.aweme:id/" + idList[2]).visibleToUser().findOnce()
        let btcText = btn_foucs_f.text()
        if (btcText == '关注') {
            let btn_foucs = btn_foucs_f.bounds()
            click(btn_foucs.centerX(), btn_foucs.centerY())
            sleep(dtime)
            log('::点击关注')
        } else {
            log('::已经点击关注')
        }

        return true
    } else {
        log('没有找到关注按钮')
        return false
    }
}

function fans_click() {
    // 点击用户信息页面[粉丝数量]位置
    let tmp_btn = id("com.ss.android.ugc.aweme:id/" + idList[1]).visibleToUser().findOnce()
    if (tmp_btn) {
        if (sub_log) { log('点击“粉丝数量”') }
        let tmp_pos = tmp_btn.bounds()
        click(tmp_pos.centerX(), tmp_pos.centerY())
        sleep(dtime + 1000)
        return true
    } else {
        if (sub_log) { log('没有找到粉丝数量') }
        sleep(dtime + 1000)
        return false
    }
}

function fans_zpListclick() {
    //点击粉丝列表页第一个人
    let tmp_btn = id('com.ss.android.ugc.aweme:id/container').visibleToUser().findOnce()
    if (tmp_btn) {
        if (sub_log) { log('点击“粉丝作品列表item[0]”') }
        let tmp_pos = tmp_btn.bounds()
        click(tmp_pos.centerX(), tmp_pos.centerY())
        sleep(dtime)
        return true
    } else {
        if (sub_log) { log('没有找到粉丝作品列表item') }
        sleep(dtime)
        return false
    }
}

function fans_Listclick() {
    //通过判断[粉丝列表item框]判断是否在粉丝列表页面
    let tmp_btn = id('com.ss.android.ugc.aweme:id/' + idList[8]).visibleToUser().findOnce()
    if (tmp_btn) {
        if (sub_log) { log('点击“粉丝作品列表item[0]”') }
        let tmp_pos = tmp_btn.bounds()
        click(tmp_pos.centerX(), tmp_pos.centerY())
        sleep(dtime + 1000)
        return true
    } else {
        if (sub_log) { log('没有找到粉丝作品列表item') }
        sleep(dtime + 1000)
        return false
    }
}

function get_dynum() {
    //获取[抖音号]
    let dynum = ''
    //let tmp_01=id("com.ss.android.ugc.aweme:id/s2y").visibleToUser().findOnce() //个人号
    let tmp_01 = id("com.ss.android.ugc.aweme:id/s2z").visibleToUser().findOnce() //个人号
    let tmp_02 = id("com.ss.android.ugc.aweme:id/s95").visibleToUser().findOnce() //企业号
    if (tmp_01) {
        dynum = tmp_01.text()
        if (sub_log) { log("个人号：" + dynum) }
    } else {
        // if(tmp_02){
        //     dynum=tmp_02.text().split('：')[1]
        //     log("企业号："+dynum)
        // }else{            
        // }
        if (sub_log) { log('没有找到[抖音号]') }
    }
    return dynum
}

function get_fansNum() {
    //获取[粉丝数量]
    let fans_num = 0
    let tmp_btn = id("com.ss.android.ugc.aweme:id/s9f").visibleToUser().findOnce()
    if (tmp_btn) {
        fans_num = tmp_btn.text()
        if (fans_num.indexOf('万') > -1) {
            fans_num = fans_num.split('万')[0]
            fans_num = fans_num * 10000
        }
        if (sub_log) { log('粉丝数：' + fans_num) }
    } else {
        if (sub_log) { log('没有找到粉丝数量') }
    }
    return fans_num
}

function get_fansName() {
    // fullId = com.ss.android.ugc.aweme:id/mcj
    let tmp_btn = id("com.ss.android.ugc.aweme:id/" + idList[3]).visibleToUser()
    if (tmp_btn.exists()) {
        let fsname = id("com.ss.android.ugc.aweme:id/" + idList[3]).visibleToUser().findOnce().text()
        log('粉丝：' + fsname)
        sleep(dtime)
        return fsname
    } else {
        log('没有找到')
        sleep(dtime)
        return ''
    }
}

function chk_userPage() {
    // 点击用户信息页面[粉丝数量]位置
    let tmp_btn = id("com.ss.android.ugc.aweme:id/" + idList[1]).visibleToUser().findOnce()
    if (tmp_btn) {
        if (sub_log) { log('在用户信息页面') }
        return true
    } else {
        if (sub_log) { log('不在用户信息页面') }
        return false
    }
}

function chk_zbj() {
    //通过判断[用户信息页面头像框]判断是否在用户信息页面
    let tmp_btn = id("com.ss.android.ugc.aweme:id/" + idList[7]).visibleToUser().findOnce()
    if (tmp_btn) {
        if (sub_log) { log('在直播间页面') }
        return true
    } else {

        if (sub_log) { log('不在直播间页面') }
        return false
    }
}

function chk_indexPage() {
    //通过判断[分享按钮]判断是否在首页
    let tmp_btn = id('com.ss.android.ugc.aweme:id/ovn').visibleToUser().findOnce()
    if (tmp_btn) {
        if (sub_log) { log('在首页') }
        return true
    } else {
        if (sub_log) { log('不在首页') }
        return false
    }
}

function chk_fansListPage() {
    let tmp_btn = id("com.ss.android.ugc.aweme:id/" + idList[1]).visibleToUser().findOnce()
    if (!tmp_btn) {
        if (sub_log) { log('在粉丝列表页') }
        return true
    } else {
        if (sub_log) { log('不在粉丝列表首页') }
        return false
    }
}

function chk_fansVideoPlayPage() {
    //通过判断[视频最下方评论框]判断是否在粉丝作品播放页面
    let tmp_btn = id('com.ss.android.ugc.aweme:id/cr3').visibleToUser().findOnce()
    if (tmp_btn) {
        if (sub_log) { log('在粉丝作品播放页') }
        return true
    } else {
        if (sub_log) { log('不在粉丝作品播放页') }
        return false
    }
}

function chk_maxDown() {
    let tmp_btn = text('暂时没有更多了')
    if (tmp_btn.exists()) {
        if (sub_log) { log('到底了') }
        return true
    } else {
        if (sub_log) { log('没有到底') }
        return false
    }
}

function h_move(x1, y1, x2, y2) {
    if (sub_log) { log('滑动屏幕') }
    swipe(random(x1 - 25, x1 + 25), random(y1 - 25, y1 + 25), random(x2 - 25, x2 + 25), random(y2 - 25, y2 + 25), random(300, 500))
    sleep(dtime)
}

function i_move(x1, y1) {
    if (sub_log) { log('::滑动屏幕') }
    y1 = random(y1 - 10, y1 + 10)
    swipe(random(x1 - 25, x1 + 25), y1, random(x1 - 25, x1 + 25), y1 - 500, 450)
    sleep(dtime)
}

function reply() {
    //评论
    let tmp_btn = desc("评论输入框").visibleToUser().findOnce() //最下方文本框
    if (tmp_btn) {
        if (sub_log) { log('填写评论') }
        tmp_btn.setText(postList[Math.floor(Math.random() * postList.length)])
        sleep(random(stime, etime))
        let rep_btn = id("com.ss.android.ugc.aweme:id/" + idList[10]).visibleToUser().findOnce() //发送按钮
        if (rep_btn) {
            sleep(random(stime, etime))
            let tmp_pos = rep_btn.bounds()
            click(tmp_pos.centerX(), tmp_pos.centerY())
            if (sub_log) { log('点击“reply”按钮') }
            sleep(dtime)
            return true
        } else {
            if (sub_log) { log('没有找到“reply”按钮') }
            return false
        }
    } else {
        if (sub_log) { log('没有找到评论文本框') }
        return false
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

// function init() {
//     importClass(com.stardust.autojs.core.accessibility.AccessibilityBridge.WindowFilter);
//     let bridge = runtime.accessibilityBridge;
//     let bridgeField = runtime.getClass().getDeclaredField("accessibilityBridge");
//     let configField = bridgeField.getType().getDeclaredField("mConfig");
//     configField.setAccessible(true);
//     configField.set(bridge, configField.getType().newInstance());
//     bridge.setWindowFilter(new JavaAdapter(AccessibilityBridge$WindowFilter, {
//         filter: function (info) {
//             return true;
//         }
//     }));
// }

function init(){
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

