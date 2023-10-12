"ui";

/* 微信全自动点赞脚本 1.0.01
 * @Author: topbrids@gmail.com 
 * @Date: 2023-01-08 22:32:33 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-02-08 21:10:25
 */
//定义全局变量
let window;
let sub_log = true;
let h = device.height;
let w = device.width;
let nowSlip = 0;
let nowBigSlip = 0;
let nowClick = 0;
let sameName = ''
let sameNameClick = 0
let name = ''
let oldName = ''
let dtime = 1000
let dzCount = 0
let dzCountTotal = 0
let sName = '小师妹6166'
let proId = '1001'
let exitFlag = false;
let storage = null;
let sex = ''
let isshow = true;
let androidId = device.getAndroidId();
let numNameList = ['床垫CaiCai', '177的刀刀', '牛嘞个牛2022']
let launchAppName = "微信"


/********************************************UI部分***********************************************/
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
            <input id="launchAppName" inputType="text" gravity="left" w="*" text="微信" />
        </horizontal>
        {/* androidId */}
        {/* <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="项目ID:" />
            <input id="run_Pro" inputType="text" gravity="left" w="*" text="1001" />
        </horizontal> */}
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="操作间隔:" />
            <input id="dtime" inputType="number" gravity="center" w="80" text="3" />
            <text textSize="15sp" textColor="black" text=" 秒 " />
        </horizontal>
        <horizontal>
            <text marginLeft="6" textSize="15sp" textColor="black" text="点赞次数:" />
            <input id="dzNum" inputType="number" gravity="center" w="80" text="10" />
            <text textSize="15sp" textColor="black" text=" 次 " />
        </horizontal>

        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="about" text="使用说明" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="customize" h="50" text="开始运行" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="stop" h="50" text="停止运行" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="xzp" h="50" text="选作品" />
        <button style="Widget.AppCompat.Button.Colored" gravity="center" id="mylog" h="50" text="日志" />
        <text text="" />
        <text gravity="center" textSize="15sp" textColor="red" text="作者:微信wkc19891" />
        <text text="" />
        <text gravity="center" textSize="12sp" text="视频号评论点赞助手 ver 1.0 " />
    </vertical>
);
init();

let thread = null;
let thread2 = null;

ui.d_ID.setText(androidId);
ui.run_Pro.setText(proId);
let date = DateFormat()
let kk = 'topbrids@gmail.com' + '-' + date + "-" + proId
storage = storages.create(kk);

let dzC = storage.get('dz-count')
if (dzC != undefined) {
    dzCountTotal = dzC
    ui.dzNum.setText(dzCountTotal);
    log('dzCountTotal,缓存参数：', dzC)
}
let dzDt = storage.get('dz-dtime')
if (dzDt != undefined) {
    dtime = Number(dzDt)
    ui.dtime.setText((dtime / 1000).toString());
    log('dtime,缓存参数：', dtime)
}

ui.customize.click(function () {
    if (thread != null && thread.isAlive()) {
        alert("注意", "脚本正在运行，请结束之前进程");
        return;
    }
    log("::脚本开始自定义运行");
    thread = threads.start(function () {
        launchAppName = ui.launchAppName.getText().toString();
        dzCountTotal = ui.dzNum.getText().toString();
        storage.put('dz-count', dzCountTotal)
        dtime = parseInt(ui.dtime.getText()) * 1000;
        storage.put('dz-dtime', dtime)
        log('::操作间隔：' + dtime / 1000 + '秒' + 'Key:' + kk)
        exitFlag = false;
        let res = RemoteFindClick('', 1)
        if (res.code == 200) {
            dzCount = res.nowTotal == undefined ? 0 : res.nowTotal
            log('远端获取点赞次数', dzCount)
        }
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
        "● 程序需要悬浮窗和无障碍权限\n（设置→辅助功能→无障碍→本 APP）\n ● 程序工作原理为模拟点击，基于Auto.js框架+JavaScript脚本执行，部分手机可能不支持\n ● 请确保进入 抖音 且位于 要进行评论的直播间 \n ● 安卓版本低于安卓7，部分功能可能无法执行 \n ● 测试机型：Redmi k50，Android 12，MiUI 13稳定版 \n点赞次数设置为0则为无限点赞"
    )
});

ui.mylog.click(function () {
    app.startActivity("console");
});

ui.xzp.click(function () {
    auto.waitFor();//等待获取无障碍辅助权限
    show();
});

function show() {
    log('::选作品脚本启动')
    thread2 = threads.start(function () {
        console.show()
        window = floaty.rawWindow(
            <vertical>
                <button bg="#98FB98" id="meLike">喜欢</button>
                <button bg="#FFD700" id="closeXfc">关闭</button>
            </vertical>
        );

        window.meLike.click(() => {
            let isId = id('com.tencent.mm:id/hft')
            if (isId.exists()) {
                let name = isId.visibleToUser().findOnce().text()
                if (name != '' && name != undefined) {
                    toastLog('获取到视频号主:' + name)
                    toastLog('正在上报服务器...')
                    thread2 = threads.start(function () {
                        let r2 = 'http://101.32.178.79:30019/api/setvu'
                        let r = http.get(r2 + '?vu=' + name);
                        let d = r.body.json()
                        if (d.code == 200) {
                            toastLog('上报服务器成功=>' + JSON.stringify(d))
                        } else {
                            toastLog('上报服务器失败=>' + JSON.stringify(d))
                        }
                    });
                }
            } else {
                toastLog('当前不在微信短视频页面')
                toastLog('上报失败')
            }
        });

        window.closeXfc.click(() => {
            window.close()
            toast("关闭选作品")
        });

        setInterval(() => { }, 1000);
        ui.post(function () {
            let dw = device.width;
            let dh = device.height;
            let ww = window.width;
            let wh = window.height;
            let x = (dw - ww) / 2;
            let y = (dh - wh) / 2;
            window.setPosition(x, y);
        }, 300);
    })

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
 * 核心算法
 */
function core() {
    //准备工作
    StartApp()
    // log('::点击发现')
    // text('发现').findOnce().parent().click()
    // sleep(random(2200, 3500))

    log('::点击放大镜')
    FindClickUi('com.tencent.mm:id/gsl', true)
    sleep(random(2200, 3500))

    log('::输入搜索内容')
    setText('牛牛2023牛牛')
    sleep(random(2200, 3500))
    log('::点击搜索')
    // let isHaveSbtn = id('com.tencent.mm:id/m94').exists()  //desc('小程序、公众号、文章、朋友圈和表情等按钮').exists()
    while (!id('com.tencent.mm:id/m94').exists()) {
        log("等待搜索按钮加载");
        //点一下搜索框
        h_move_1(w / 2, 10, w / 2, h * 0.8)
        sleep(2000)
        h_move_2(w / 2, h * 0.8, w / 2, 10)
        sleep(2000)
        if (exitFlag) {
            log('::主动退出脚本')
            break
        }
        // isHaveSbtn = id('com.tencent.mm:id/m94').exists()
        continue;
    }
    sleep(random(2200, 3500))
    //let tmp = desc('小程序、公众号、文章、朋友圈和表情等按钮').visibleToUser().findOnce()
    let tmp = id('com.tencent.mm:id/lm0').findOnce()
    if (tmp) {
        let tmp2 = tmp.bounds()
        click(tmp2.centerX(), tmp2.centerY())
    }
    sleep(random(2200, 3500))

    log('::点击视频号')

    while (!className("android.view.View").text("视频号,按钮,13之2, 列表中的第 1 项，共有 0 项").exists()) {
        log("::等待视频号按钮加载");
        sleep(1000)
        if (exitFlag) {
            log('::主动退出脚本')
            break
        }
        continue;
    }
    let sphBut = className("android.view.View").text("视频号,按钮,13之2, 列表中的第 1 项，共有 0 项").findOnce()
    if (sphBut) {
        let tmp = sphBut.bounds()
        click(tmp.centerX(), tmp.centerY())
    }
    sleep(random(2200, 3500))
    log('::启动工作完成,进入循环拿号模式')

    //远端拿号
    while (true) {
        //远端拿号
        let numName = GetRemoteNumber(proId);
        if (numName == '' || numName == undefined) {
            let sl = random(5000, 8000)
            log('::远端暂时没号，休息' + sl / 1000, '秒')
            sleep(sl)
            continue;
        } else {
            log('::远端拿到视频号:', numName)
        }
        sName = numName;
        log('::粘贴文本')
        setText(numName)
        sleep(random(2200, 3500))

        log('::循环-开始')
        let searchBtn = id('com.tencent.mm:id/m6r').visibleToUser().findOnce()
        if (searchBtn) {
            log('::确认点击搜索')
            searchBtn.click()
        }
        sleep(random(2200, 3500))
        log('::点击进入主页')
        let sNum = 0
        while (!textContains("帐号, " + numName).exists() && sNum < 8) {
            log('::暂未搜索到指定视频号主,继续等待搜索')
            sleep(random(1000, 2000))
            sNum++;
            continue;
        }
        if (!textContains("帐号, " + numName).exists() && sNum >= 8) {
            NetDelVu(numName)
            log('::8次都未搜到指定视频号主,上报移除:' + numName)
            continue;
        }
        while (textContains("帐号, " + numName).exists()) {
            let au = textContains("帐号, " + numName).findOnce()
            if (au != null && au != undefined) {
                let tmp2 = au.bounds()
                click(tmp2.centerX(), tmp2.centerY())
            }
            log('::没有进去主页再进入一次')
            sleep(random(1000, 2000))
            continue;
        }
        sleep(random(2200, 3500))
        log('::获取主页视频')
        let fristV = VideoList()
        let lookV = 0;
        while (fristV == null && lookV < 4) {
            fristV = VideoList()
            lookV++;
            sleep(random(1000, 2000))
            log('::再次获取主页视频')
            continue;
        }
        if (fristV != null) {
            //进入首作品
            let tmp = fristV.bounds()
            click(tmp.centerX(), tmp.centerY())
            sleep(random(2200, 3500))
            fristV = VideoList()
            if (fristV != null) {
                log('::重新点击主页视频')
                continue;
            }
            nowBigSlip = 0;
            while (true) {
                //查看视频点赞情况
                let plNum = 0

                if (id('com.tencent.mm:id/bje').exists()) {
                    plNum = id('com.tencent.mm:id/bje').findOnce().text()
                }
                if (plNum > 5) {
                    log('点击弹出评论', plNum)
                    ClickCommentShow()
                    sleep(random(2200, 3500))
                    nowSlip = 0;
                    nowClick = 0;
                    while (true) {
                        if (nowSlip >= 10) {
                            if (nowClick < 1) {
                                log('::滑动点赞率太低,返回下一个视频')
                                back()
                                sleep(dtime)
                                let pl1 = id('com.tencent.mm:id/be_').visibleToUser().findOnce()
                                if (pl1 != null) {
                                    let tmp_n_p = pl1.bounds()
                                    click(tmp_n_p.centerX(), tmp_n_p.centerY())
                                    sleep(random(2200, 3500))
                                }
                                break;
                            }
                            nowSlip = 0;
                            nowClick = 0;
                        }
                        //排除 点赞超限制 账号封禁的异常
                        //封禁止 当天超限制
                        let fj = id('com.tencent.mm:id/guw')
                        if (fj.exists()) {
                            log('::被封禁了或者进入点击超限制了,休息10分钟...')
                            sleep(1 * 10 * 60 * 1000)
                            fj = id('com.tencent.mm:id/guw')
                            if (fj) {
                                fj.visibleToUser().findOnce().click()
                            }
                            log('::休息完成--点击我知道...')
                            //alert("提示", "被封禁了或者进入点击超限制了,休息1小时...")
                            //换号TODO:
                        }
                        //滑动评论区点赞
                        let lx = id('com.tencent.mm:id/lwb').visibleToUser().find()
                        if (lx.length >= 1) {
                            //判断是不是底部标识出来|下划线是否出现
                            //nova5
                            let line = id('com.tencent.mm:id/fms').visibleToUser()//.find()
                            //k50
                            let line1 = className('android.widget.LinearLayout').depth(3).drawingOrder(2).indexInParent(1).visibleToUser();
                            //模拟器
                            let line_m = id('com.tencent.mm:id/aym').visibleToUser()
                            //兼容评论底部下划线
                            if (line.exists() || line1.exists() || line_m.exists()) {
                                //点完剩余的返回
                                log('::评论底部标识出现,点完返回...')
                                LoveClickList(lx)
                                sleep(random(2200, 3500))
                                while (id('com.tencent.mm:id/e8x').exists()) {
                                    let ar2 = id('com.tencent.mm:id/e8x').visibleToUser().findOnce()
                                    if (ar2 != null) {
                                        log('::点完关闭评论头像1')
                                        let tmp_n_p = ar2.bounds()
                                        click(tmp_n_p.centerX(), tmp_n_p.centerY())
                                    }
                                    sleep(random(2200, 3500))
                                    continue;
                                }
                                // log('::点完物理返回')
                                // back()
                                sleep(random(2200, 3500))
                                while (id('com.tencent.mm:id/be_').exists()) {
                                    let pl1 = id('com.tencent.mm:id/be_').visibleToUser().findOnce()
                                    if (pl1 != null) {
                                        log('::点完关闭评论1')
                                        let tmp_n_p = pl1.bounds()
                                        click(tmp_n_p.centerX(), tmp_n_p.centerY())
                                    }
                                    log('::点完物理,检查评论是否还在')
                                    sleep(random(2200, 3500))
                                    continue;
                                }
                                break;
                            } else {
                                //点个小心心吧
                                LoveClick(lx)
                                while (id('com.tencent.mm:id/e8x').exists()) {
                                    let ar2 = id('com.tencent.mm:id/e8x').visibleToUser().findOnce()
                                    if (ar2 != null) {
                                        let tmp_n_p = ar2.bounds()
                                        click(tmp_n_p.centerX(), tmp_n_p.centerY())
                                    }
                                    sleep(random(2200, 3500))
                                    log('::检查头像是否关闭2')
                                    continue;
                                }
                                if (sameNameClick > 5) {
                                    log('::划到底部卡主，跳出进行下一个视频')
                                    break;
                                }
                                i_move(w / 2, h * 0.85)
                            }
                        } else {
                            log('::该作品暂时没有评论或评论条数太少不点赞1', lx.length)
                            break;
                        }
                        if (exitFlag) {
                            log('::主动退出脚本 点赞' + sName + '次数' + dzCount)
                            break
                        }
                        if (dzCount > dzCountTotal && dzCountTotal != 0) {
                            log('::本次点赞任务已经完成 点赞' + sName + '次数' + dzCount)
                            break
                        }
                    }
                } else {
                    log('评论数量:', plNum, ',直接跳过')
                }
                //检查点击评论头像是否取消
                while (id('com.tencent.mm:id/e8x').exists()) {
                    let ar2 = id('com.tencent.mm:id/e8x').visibleToUser().findOnce()
                    if (ar2 != null) {
                        let tmp_n_p = ar2.bounds()
                        click(tmp_n_p.centerX(), tmp_n_p.centerY())
                    }
                    sleep(random(2200, 3500))
                    continue;
                }
                //检查关闭弹出的评论
                while (id('com.tencent.mm:id/be_').exists()) {
                    let pl1 = id('com.tencent.mm:id/be_').visibleToUser().findOnce()
                    if (pl1 != null) {
                        let tmp_n_p = pl1.bounds()
                        click(tmp_n_p.centerX(), tmp_n_p.centerY())
                    }
                    sleep(random(2200, 3500))
                    continue;
                }
                //继续下滑大视频
                h_move(w / 2, h * 0.8, w / 2, h * 0.1)
                sleep(random(2200, 3500))
                //判断到底是否TODO:
                let bigLine = className('android.widget.LinearLayout').depth(2).drawingOrder(2).indexInParent(4).visibleToUser();
                if (bigLine.exists()) {
                    log('::大视频滑动出现下划线,到底跳出视频,到搜索新up主页')
                    back()
                    sleep(random(2200, 3500))
                    back()
                    sleep(random(2200, 3500))
                    break;
                }
                //只看前10个作品
                if (nowBigSlip >= 6) {
                    log('::大视频滑动出,超出6个视频,到搜索新up主页')
                    //确保返回到主页
                    back()
                    sleep(random(2200, 3500))

                    //确保返回到搜索页
                    back()
                    sleep(random(2200, 3500))
                    break;
                }
                if (dzCount > dzCountTotal && dzCountTotal != 0) {
                    log('::本次点赞任务已经完成 点赞' + sName + '次数' + dzCount)
                    break
                }
                if (exitFlag) {
                    log('::主动退出脚本 点赞' + sName + '次数' + dzCount)
                    break
                }
            }
        } else {
            log('::没有发现up主作品')
        }
        if (exitFlag) {
            log('::主动退出脚本 点赞' + sName + '次数' + dzCount)
            break
        }
        if (dzCount > dzCountTotal && dzCountTotal != 0) {
            log('::本次点赞任务已经完成 点赞' + sName + '次数' + dzCount)
            alert("提示", "本次点赞任务已经完成 点赞:" + dzCount)
            break
        }
        sleep(dtime)
    }
}
function NetDelVu(numName) {
    try {
        let r1 = 'http://101.32.178.79:30019/api/delVu?vu=' + numName
        http.get(r1);
    } catch (error) {
        log('::远发送远端删除视频号异常')
    }
}
function NetClickRecord(androidId, launchAppName, sName) {
    try {
        let r1 = 'http://101.32.178.79:30019/api/rDz?dId=' + androidId + "-" + launchAppName + '&vu=' + sName
        http.get(r1);
    } catch (error) {
        log('::远发送远端点击记录异常')
    }
}
function GetRemoteNumber(proId) {
    let data = ''
    try {
        let r1 = 'http://101.32.178.79:30019/api/getvu'
        let r = http.get(r1);
        data = r.body.json()
    } catch (err) {
        log('::远端拿号异常')
    }
    if (data == '' || data.code != 200) {
        return ''
    }
    let name = data.vu;
    return name;
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
/** 
 * @description: 启动app
 * @param: null
 * @return: null
 */
function StartApp() {
    log("::启动微信");
    if (!launchApp(launchAppName)) {
        console.error("::找不到微信!");
        return;
    }
    while (!text('发现').exists()) {
        log("::等待加载出主页");
        sleep(1000)
        continue;
    }
    sleep(1000)
}

/**
 * 爱心点赞
 * @param {*} lx 评论列表
 */
function LoveClick(lx) {
    if (lx[0].parent() != null && lx[0].parent().parent() != null) {
        //评论人 和 时间
        let name = lx[0].parent().parent().findOne(id('com.tencent.mm:id/hft')).text()
        let time = lx[0].parent().parent().findOne(id('com.tencent.mm:id/bk7')).text()
        let isSph = lx[0].parent().parent().findOne(desc('视频号logo'))
        let timeText = lx[0].parent().parent().findOne(id('com.tencent.mm:id/bk7')).text()
        if (name == sName) {
            log('::作者评论不点赞')
        } else {
            if (time.includes('小时') || time.includes('分钟') || timeText.startsWith('1天前') || timeText.startsWith('2天前')) {
                //去重远程点赞统计
                let findDz2Res = RemoteFindClick(name)
                let dz = -1;
                if (findDz2Res.code == 200) {
                    if (findDz2Res.data == 1) {
                        dz = 1
                    }
                    dzCount = findDz2Res.nowTotal == undefined ? 0 : findDz2Res.nowTotal
                }
                if (dz == -1) {
                    let isSph1 = ''
                    if (isSph != null) {
                        isSph1 = isSph.desc()
                    }
                    let tmp_n = lx[0].bounds()
                    if (isSph1 == '视频号logo') {
                        click(tmp_n.centerX(), tmp_n.centerY())
                        dzCount++
                        nowClick++
                        RemoteAddClick(name, 1)
                        log('::给,' + name + ',视频号,' + '点赞,' + '累计点赞次数' + dzCount)
                        NetClickRecord(androidId, launchAppName, sName)
                    } else {
                        //点击头像查看个人信息
                        let isClickPic = false
                        let pic = lx[0].parent().parent().findOne(id('com.tencent.mm:id/a27'))
                        if (pic != null) {
                            let tmp_n_p = pic.bounds()
                            click(tmp_n_p.centerX(), tmp_n_p.centerY())
                            sleep(random(2200, 3500))
                        }
                        //验证是否点击头像成功弹框
                        let ar = id('com.tencent.mm:id/e8x').visibleToUser().findOnce()
                        if (ar != null) {
                            isClickPic = true
                        }
                        //验证是否偶然进入视频界面
                        let ar1 = id('com.tencent.mm:id/gyx').visibleToUser().findOnce()
                        if (ar1 != null) {
                            isClickPic = true
                        }
                        //获取性别
                        let _sex = id('com.tencent.mm:id/e92').visibleToUser().findOnce()
                        if (_sex != null) {
                            sex = _sex.text()
                        } else {
                            sex = ''
                        }
                        if (isClickPic || sex != '') {
                            back()
                            sleep(random(2200, 3500))
                        }
                        //复检 验证是否点击头像成功弹框
                        while (id('com.tencent.mm:id/e8x').exists()) {
                            let ar2 = id('com.tencent.mm:id/e8x').visibleToUser().findOnce()
                            if (ar2 != null) {
                                let tmp_n_p = ar2.bounds()
                                click(tmp_n_p.centerX(), tmp_n_p.centerY())
                                sleep(random(2200, 3500))
                            }
                            sleep(random(1000, 2000))
                            continue;
                        }

                        if (sex == '男') {
                            click(tmp_n.centerX(), tmp_n.centerY())
                            dzCount++
                            nowClick++
                            RemoteAddClick(name, 0)
                            log('::给' + name + ',' + sex + ',' + '点赞' + '累计点赞次数' + dzCount)
                            NetClickRecord(androidId, launchAppName, sName)
                        } else {
                            log('性别不符', name, ' | ', sex, '暂不点赞')
                        }
                    }

                } else {
                    log('::' + name + ',已点赞,本次不点,累计点赞次数' + dzCount)
                    if (sameName != name) {
                        sameName = name
                        sameNameClick = 0
                    } else {
                        sameNameClick++
                    }
                    nowClick++
                }
            } else {
                log('::', name, ',评论时间,' + time + ',不点赞,累计点赞次数:' + dzCount)
            }
        }
    } else {
        log('::父组件不在1')
    }
}

/**
 * 
 * @param {*} lx 评论列表
 */
function LoveClickList(lx) {
    lx.forEach((v, i) => {
        if (lx[i].parent() != null && lx[i].parent().parent() != null) {
            let name = lx[i].parent().parent().findOne(id('com.tencent.mm:id/hft')).text()
            let time = lx[i].parent().parent().findOne(id('com.tencent.mm:id/bk7')).text()
            let isSph = lx[i].parent().parent().findOne(desc('视频号logo'))
            if (time.includes('小时') || time.includes('分钟')) {
                let tmp_n = lx[i].bounds()
                if (name == sName) {
                    log('::作者评论不点赞')
                } else {
                    let findDz2Res = RemoteFindClick(name)
                    let dz = -1;
                    if (findDz2Res.code == 200) {
                        if (findDz2Res.data == 1) {
                            dz = 1
                        }
                        dzCount = findDz2Res.nowTotal == undefined ? 0 : findDz2Res.nowTotal
                    }
                    if (dz == -1) {
                        let isSph1 = ''
                        if (isSph != null) {
                            isSph1 = isSph.desc()
                        }
                        if (isSph1 == '视频号logo') {
                            click(tmp_n.centerX(), tmp_n.centerY())
                            dzCount++
                            nowClick++
                            RemoteAddClick(name, 1)
                            log('::给,' + name + ',视频号' + '点赞' + ',累计点赞次数,' + dzCount)
                            NetClickRecord(androidId, launchAppName, sName)
                        } else {
                            //点击头像查看个人信息
                            let isClickPic = false
                            let pic = lx[i].parent().parent().findOne(id('com.tencent.mm:id/a27'))
                            if (pic != null) {
                                let tmp_n_p = pic.bounds()
                                click(tmp_n_p.centerX(), tmp_n_p.centerY())
                                sleep(random(2200, 3500))
                            }
                            //验证是否点击头像成功弹框
                            let ar = id('com.tencent.mm:id/e8x').visibleToUser().findOnce()
                            if (ar != null) {
                                isClickPic = true
                            }
                            //验证是否偶然进入视频界面
                            let ar1 = id('com.tencent.mm:id/gyx').visibleToUser().findOnce()
                            if (ar1 != null) {
                                isClickPic = true
                            }
                            //获取性别
                            let _sex = id('com.tencent.mm:id/e92').visibleToUser().findOnce()
                            if (_sex != null) {
                                sex = _sex.text()
                            } else {
                                sex = ''
                            }
                            if (isClickPic || sex != '') {
                                back()
                                sleep(random(2200, 3500))
                            }
                            //复检 验证是否点击头像成功弹框
                            while (id('com.tencent.mm:id/e8x').exists()) {
                                let ar2 = id('com.tencent.mm:id/e8x').visibleToUser().findOnce()
                                if (ar2 != null) {
                                    let tmp_n_p = ar2.bounds()
                                    click(tmp_n_p.centerX(), tmp_n_p.centerY())
                                    sleep(random(2200, 3500))
                                }
                                sleep(random(1000, 2000))
                                continue;
                            }
                            if (sex == '男') {
                                click(tmp_n.centerX(), tmp_n.centerY())
                                dzCount++
                                nowClick++
                                RemoteAddClick(name, 0)
                                log('::给,' + name + ',' + sex + ',' + '点赞' + ',累计点赞次数,' + dzCount)
                                NetClickRecord(androidId, launchAppName, sName)
                            } else {
                                log('性别不符,', name, ' | ', sex, ',暂不点赞')
                            }
                        }
                    } else {
                        log('::' + name + ',已点赞,本次不点,累计点赞次数' + dzCount)
                        nowClick++
                    }
                }
                sleep(random(2200, 3500))
            } else {
                log('::', name, ',评论时间,' + time + ',不点赞,累计点赞次数:' + dzCount)
            }
        } else {
            log('::父组件不在2')
        }
    });
}


/**
 * 视频号作者主页视频
 * 返回非直播的第一个元素
 */
function VideoList() {
    try {
        //视频个数
        let videos = id('com.tencent.mm:id/i5j').visibleToUser().find()
        if (videos.length <= 0) {
            videos = id('com.tencent.mm:id/nmz').visibleToUser().find()
        }
        if (videos.length > 0) {
            //直播
            let lives = text('直播中').find()
            log('::直播个数=' + lives.length > 0 ? '::直播中' : '::未直播')
            if (lives.length > 0) {
                if (videos.length > 1) {
                    return videos[1]
                } else {
                    return null;
                }

            } else {
                return videos[0]
            }
        } else {
            return null
        }
    } catch (e) {
        log('视频号作者主页视频,发送错误')
        return null
    }
}
/**
 * 点击作品评论展示
 */
function ClickCommentShow() {
    let tmp = id('com.tencent.mm:id/bjq').visibleToUser().findOne()
    if (tmp) {
        let tmp2 = tmp.bounds()
        click(tmp2.centerX(), tmp2.centerY())
    }
}

function FindClickUi(ids, isClick) {
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
/**
 * 评论列表滑动
 * @param {*} x1 
 * @param {*} y1 
 */
function i_move(x1, y1) {
    if (sub_log) { log('::评论滑动屏幕') }
    nowSlip++
    y1 = random(y1 - 10, y1 + 10)
    swipe(random(x1 - 25, x1 + 25), y1, random(x1 - 25, x1 + 25), y1 - 250, 500)
    sleep(random(2200, 3500))
}

function h_move(x1, y1, x2, y2) {
    if (sub_log) { log('::大页视频滑动屏幕') }
    nowBigSlip++
    swipe(random(x1 - 25, x1 + 25), random(y1 - 25, y1 + 25), random(x2 - 25, x2 + 25), random(y2 - 25, y2 + 25), random(400, 500))
    sleep(random(2200, 3500))
}

function h_move_1(x1, y1, x2, y2) {
    swipe(random(x1 - 25, x1 + 25), y1, random(x2 - 25, x2 + 25), random(y2 - 25, y2 + 25), random(400, 500))
}

function h_move_2(x1, y1, x2, y2) {
    swipe(random(x1 - 25, x1 + 25), random(y1 - 25, y1 + 25), random(x2 - 25, x2 + 25), y2, random(400, 500))
}
/**
 * 周格式化
 * @param {} time 
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
    // let date = myDate.getDay() + 1;
    let now = year + "-" + mon;//+ "-" + date;
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

function init去限制() {
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