var str = "333444555666777888";
console.log(str.replace(/(\d)(?=(\d{3})+$)/g, "$1,"));