var exec = require('child_process').exec;


var child = exec("node test3.js", function (error, stdout, stderr) {
    console.log("子进程结束");
    if (error) {
        console.log(error)
    } else {
        console.log(stdout);
    }
});
console.log("running");
child.on("error", function (e) {
    console.log("error");
});
child.on("exit", function (e) {
    console.log("exit");
});

process.on("exit", function (e) {
    console.log("over");
});