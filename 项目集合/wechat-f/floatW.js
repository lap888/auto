// # 商业转载请联系作者获得授权，非商业转载请注明出处。
// # For commercial use, please contact the author for authorization. For non-commercial use, please indicate the source.
// # 协议(License)：署名-非商业性使用-相同方式共享 4.0 国际 (CC BY-NC-SA 4.0)
// # 作者(Author)：诗和远方
// # 链接(URL)：https://www.kiana.run/share/392.html
// # 来源(Source)：Kiana日记

console.show();
var str = "";
str += "屏幕宽度:" + device.width;
str += "\n屏幕高度:" + device.height;
str += "\nbuildId:" + device.buildId;
str += "\n主板:" + device.board;
str += "\n制造商:" + device.brand;
str += "\n型号:" + device.model;
str += "\n产品名称:" + device.product;
str += "\nbootloader版本:" + device.bootloader;
str += "\n硬件名称:" + device.hardware;
str += "\n唯一标识码:" + device.fingerprint;
str += "\nIMEI: " + device.getIMEI();
str += "\nAndroidId: " + device.getAndroidId();
str += "\nMac: " + device.getMacAddress();
str += "\nAPI: " + device.sdkInt;
str += "\n电量: " + device.getBattery();
log(str);

// 屏幕宽度:1220
// 屏幕高度:2712
// buildId:SKQ1.220303.001
// 主板:diting
// 制造商:Redmi
// 型号:22081212C
// 产品名称:diting
// bootloader版本:unknown
// 硬件名称:qcom
// 唯一标识码:Redmi/diting/diting:12/SKQ1.220303.001/V13.0.10.0.SLFCNXM:user/release-keys
// IMEI: null
// AndroidId: 51be8844e047c688
// Mac: 02:00:00:00:00:00
// API: 31
// 电量: 70

