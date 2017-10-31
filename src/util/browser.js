/**
 * 获取当前设备类型
 * @author chuans
 */

const ua = navigator.userAgent;

// 是否是Android
export const isAndroid = ua.toLowerCase().indexOf( "android" ) > -1 || ua.toLowerCase().indexOf( "linux" ) > -1;

// 是否是iPad
export const isIpad = ua.indexOf( "iPad" ) > -1;

// 是否在微信中
export const isWechat= ua.toLowerCase().indexOf( "micromessenger" ) > -1;

// 是否是iPhone
export const isIphone= ua.indexOf( "iPhone" ) > -1;

// 是否在苹果设备
export const isApple = isIphone || isIpad;

// 是否是移动设备
export const isMobile = isApple || isAndroid;

