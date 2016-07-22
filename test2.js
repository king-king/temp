var spawn = require('child_process').spawn;

var child = spawn("node", ["test3.js"]);
child.on("error", function (e) {
    console.log(e);
});
child.on("exit", function (e) {
    console.log("exit");
});