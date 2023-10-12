// log('9999')
console.log(nowtime())

function nowtime() {
    var today = new Date();
    var date = today.getFullYear() + '年 ' + (today.getMonth() + 1) + '月 ' + today.getDate() +
        '日 ';
    var time = today.getHours() + "时 " + today.getMinutes() + "分 " + today.getSeconds() + '秒';
    var dateTime = date + ' ' + time;
    return '你好哥 我们相遇在 北京时间' + dateTime
}


if (id("iv_mine_close").exists()) {
    console.log('偶发弹出聊天招呼,点击关闭')
    id("iv_mine_close").findOne().click()
}

id("recyclerview").findOne().children().forEach(child => {
    var target = child.findOne(id("chatlist_item_tv_name"));
    if (target) {
        console.log(target.text)
    }
    
    // target.click();
});