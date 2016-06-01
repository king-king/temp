var fs = require("fs");
fs.stat(".git/HEAD", function (err, stats) {
    console.log(stats.isDirectory());
});