/* 音频驱动
 * @Author: topbrids@gmail.com 
 * @Date: 2023-07-04 16:38:07 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2023-07-09 16:24:01
 */

//播放音乐
// media.playMusic('/storage/emulated/0/voices/sll.aac');
let i = 0
while (true) {
    welcome()
    lubo()
    palycurtime()
    console.log(i++)
   
}

//让音乐播放完
function name() {
    media.playMusic('/storage/emulated/0/voices/dgz.mp3');
    sleep(media.getMusicDuration());
}
/**
 * 欢迎点关注
 */
function welcome() {
    media.playMusic('/storage/emulated/0/voices/dgz.mp3');
    sleep(media.getMusicDuration());
}
/**
 * 录播
 */
function lubo() {
    media.playMusic('/storage/emulated/0/voices/lubo.mp3');
    sleep(media.getMusicDuration()); 
}
/**
 * 当前时间
 */
function palycurtime() {
    let d1 = new Date()
    console.log('现在是北京时间')
    media.playMusic('/storage/emulated/0/voices/dqtime1.mp3');
    sleep(media.getMusicDuration());
    console.log('n点' + d1.getHours())
    media.playMusic('/storage/emulated/0/voices/d' + d1.getHours() + '.mp3');
    sleep(media.getMusicDuration());
    console.log('n分' + d1.getMinutes())
    media.playMusic('/storage/emulated/0/voices/f' + d1.getMinutes() + '.mp3');
    sleep(media.getMusicDuration());
}
