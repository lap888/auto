"ui";
// let fv = require("./fv");
let window;

ui.layout(
    <vertical>
        <button id="显示悬浮窗">显示悬浮窗</button>
        <button id="修改悬浮窗按钮点击事件">修改悬浮窗按钮点击事件</button>
    </vertical>
);
let action = function () {
    toastLog("悬浮窗按钮点击事件");
};
ui.显示悬浮窗.click(function () {
    show();
});
ui.修改悬浮窗按钮点击事件.click(function () {
    setBtnAction(action);
});


let btnAction = function () {

    log('获取微信视频号up主')
};
function 是否有悬浮窗权限2() {
    return floaty.checkPermission();
}
function 申请悬浮窗权限2() {
    log("申请悬浮窗权限2");
    var intent = new Intent();
    intent.setAction("android.settings.action.MANAGE_OVERLAY_PERMISSION");
    activity.startActivityForResult(intent, 8000);
}
function show() {
    window = floaty.rawWindow(
        <vertical>
            <button id="btn" padding="10">
                点我
            </button>
            <button id="move" padding="10">
                移动
            </button>
        </vertical>
    );
    setSuspendedWindowMoveWithFinger(window, "move");
    window.btn.click(function () {
        btnAction();
    });
    // if (!是否有悬浮窗权限2()) {
    //     toastLog("请开启悬浮窗权限");
    //     申请悬浮窗权限2();
    //     return;
    // } else {
    //     window = floaty.rawWindow(
    //         <vertical>
    //             <button id="btn" padding="10">
    //                 点我
    //             </button>
    //             <button id="move" padding="10">
    //                 移动
    //             </button>
    //         </vertical>
    //     );
    //     setSuspendedWindowMoveWithFinger(window, "move");
    //     window.btn.click(function () {
    //         btnAction();
    //     });
    // }
}
function hide() { }
function getBtnAction() {
    return btnAction;
}
function setBtnAction(action) {
    btnAction = action;
}

function setSuspendedWindowMoveWithFinger(suspendedWindow, viewId) {
    //记录按键被按下时的触摸坐标
    var x = 0,
        y = 0;
    //记录按键被按下时的悬浮窗位置
    var windowX, windowY;
    //记录按键被按下的时间以便判断长按等动作
    var downTime;

    suspendedWindow[viewId].setOnTouchListener(function (view, event) {
        switch (event.getAction()) {
            case event.ACTION_DOWN:
                x = event.getRawX();
                y = event.getRawY();
                windowX = suspendedWindow.getX();
                windowY = suspendedWindow.getY();
                downTime = new Date().getTime();
                return true;
            case event.ACTION_MOVE:
                //移动手指时调整悬浮窗位置
                suspendedWindow.setPosition(windowX + (event.getRawX() - x), windowY + (event.getRawY() - y));
                moving = true;
                //如果按下的时间超过1.5秒判断为长按，退出脚本
                return true;
            case event.ACTION_UP:
                moving = false;
                //手指弹起时如果偏移很小则判断为点击
                if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
                    if (new Date().getTime() - downTime > 2000) {
                        hideSuspendedWindow();
                    }
                }
                return true;
        }
        return true;
    });
}