// fullId("com.tencent.mm:id/bje")
log('hello')
if (id('com.tencent.mm:id/bje').exists()) {
    let p = id('com.tencent.mm:id/bje').findOnce();
    log('p=>', p)
    // fullId("com.tencent.mm:id/bje")
    let plNum = id('com.tencent.mm:id/bje').findOnce().text()
    log('plNum=>', plNum)
}
log('ok')