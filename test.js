var str = "333444555666777888";
//console.log(str.replace(/(\d)(?=(\d{3})+$)/g, "$1,"));


var str2 = "wangqun.min.ok.js";
// 匹配.js，但不匹配min.js
console.log(str2.match(/^[a-z.]+(?!min)\.js/));