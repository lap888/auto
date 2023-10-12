log('hello')


//FindClickUi('com.tencent.mm:id/f2a', true)
//text('发现').findOnce().parent().click()


//id("f2s").className("android.widget.TextView").text("发现").findOnce().click();

id("f2s").className("android.widget.TextView").text("发现").findOne().parent().click()
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