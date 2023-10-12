/* 简单发送消息
 * @Author: topbrids@gmail.com 
 * @Date: 2023-01-28 09:59:31 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-01-28 11:24:02
 */


let h = device.height;
let w = device.width;
let textMsg = '哥哥 扣 325 295 4034'
let clickTotal = 28
let nowClick = 0
let oldName = ''

//进入消息界面
while (nowClick < clickTotal) {
    //点击进入首条红点消息
    sleep(random(1500, 2000))
    let name = id('com.tencent.mm:id/btb').find()
    let nameText = name[0].text()

    log('消息用户:', nameText)
    if (oldName != '' && nameText == oldName) {
        log('消息发送完毕~')
        break;
    }
    oldName = nameText
    let msgList = id('com.tencent.mm:id/km8').find()
    let fristMsg = null;
    // log(msgList.length > 0)
    if (msgList.length > 0) {
        fristMsg = msgList[0].parent()
    }
    if (fristMsg != null) {
        let name = fristMsg.parent().findOne(id('com.tencent.mm:id/btb')).text()
        let reg = /[0-9]+/g;

        name = name.replace(reg, "");
        if (name == '') {
            name = '你好'
        }
        let nl = name.length

        let shortName = name.substring(0, nl)
        shortName = shortName + ',' + textMsg + '🍑'
        log('点击进入首条红点消息', name, nl)
        nowClick++
        let bMsg = fristMsg.bounds();
        click(bMsg.centerX(), bMsg.centerY());
        sleep(random(1500, 2000))
        log('设置发送消息内容')
        //设置发送消息内容
        id('com.tencent.mm:id/b4a').setText(shortName)
        sleep(random(2000, 3000))
        //点击发送
        log('点击发送')
        let sendBtn = id('com.tencent.mm:id/b8k').findOnce().bounds()
        click(sendBtn.centerX(), sendBtn.centerY());
        sleep(random(2000, 3000))
        //返回消息页
        log('返回消息页')
        back()
        sleep(random(1500, 2000))
    }
    //滑动
    i_move(w / 2, h * 0.85)
    sleep(random(1500, 2000))
}


/**
 * 评论列表滑动
 * @param {*} x1 
 * @param {*} y1 
 */
function i_move(x1, y1) {
    log('::滑动消息屏幕')
    y1 = random(y1 - 10, y1 + 10)
    swipe(random(x1 - 25, x1 + 25), y1, random(x1 - 25, x1 + 25), y1 - 350, 500)
}