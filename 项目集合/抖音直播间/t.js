// //查询底部评论框是否存在
// if (find_click_ui('com.ss.android.ugc.aweme:id/e1v', true)) {
//     sleep(2000)
//     toastLog('::直接赋值')
//     setText('来了')
//     let tmp = desc('说点什么...').visibleToUser().findOnce()
//     // let tmp = id('com.ss.android.ugc.aweme:id/e1v').visibleToUser().findOnce()
//     console.log(tmp)
//     sleep(2000)
//     // tmp.setText('来了')
//     // sleep(random(stime, etime))
// }
// // let tmp = text('说点什么...').visibleToUser().findOnce()
// // let tmp = id('com.ss.android.ugc.aweme:id/e1v').visibleToUser().findOnce()
// // console.log(tmp)
// // sleep(2000)
// // tmp.setText('来了')

// function find_click_ui(ids, isClick) {
//     let tmp = id(ids).visibleToUser().findOnce()
//     if (tmp) {
//         if (isClick) {
//             let tmp2 = tmp.bounds()
//             click(tmp2.centerX(), tmp2.centerY())
//         }
//         return true;
//     } else {
//         return false;
//     }
// }

// fullId = com.ss.android.ugc.aweme:id/text
// fullId = com.ss.android.ugc.aweme:id/text

// let plText = id('com.ss.android.ugc.aweme:id/text').visibleToUser().find()
// if (plText) {
//     // log(plText[0].text())
//     // log(plText.length)
//     let plCount = plText.length
//     // 
//     let text1 = plText[Math.floor(Math.random() * plCount)].text().split('：')[1]
//     let text2 = plText[Math.floor(Math.random() * plCount)].text().split('：')[1]
//     log(text1 + " , " + text2)
// }


let cy = text('立即参与').visibleToUser().findOnce()
if (cy) {
    log('立即参与')
    sleep(1000)
    cy.click()
    sleep(1000)
}

