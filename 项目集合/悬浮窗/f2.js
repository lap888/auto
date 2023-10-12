// auto.waitFor();//等待获取无障碍辅助权限auto.waitFor();//等待获取无障碍辅助权限
let thread = null
let w = floaty.rawWindow(
    <vertical>
        <button bg="#98FB98" id="meLike">喜欢</button>
        <button bg="#FFD700" id="closeXfc">关闭</button>
    </vertical>
);
w.meLike.click(() => {
    let isId = id('com.tencent.mm:id/hft')
    if (isId.exists()) {
        let name = isId.visibleToUser().findOnce().text()
        if (name != '' && name != undefined) {
            toastLog('获取到视频号主:' + name)
            toastLog('正在上报服务器...')
            thread = threads.start(function () {
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

w.closeXfc.click(() => {
    if (thread != null && thread.isAlive()) {
        threads.shutDownAll();
        toast("停止运行！")
    }
    w.close()
});
console.show()
setInterval(() => { }, 1000);

ui.post(function () {
    let dw = device.width;
    let dh = device.height;
    let ww = w.width;
    let wh = w.height;
    let x = (dw - ww) / 2;
    let y = (dh - wh) / 2;
    w.setPosition(x, y);
}, 300);