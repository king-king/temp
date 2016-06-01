/**
 * Created by wq on 16/6/1.
 */

var fs = require("fs");
var http = require("http");
var url = require("url");
var path = require("path");

http.createServer(function (req, res) {
    var info = path.parse(url.parse(req.url).path);
    if (info.ext) {
        // 按照文件处理
        fs.access(".." + info.dir + "/" + info.base, fs.F_OK, function (err) {
            if (err) {
                // console.log(info);
                // console.log(".." + info.dir + "/" + info.base);
                res.write("404");
                res.end();
            } else {
                fs.createReadStream(".." + info.dir + "/" + info.base).pipe(res);
            }
        })
    } else {
        // 按照文件夹处理,显示文件夹内的内容
        fs.readdir("../" + url.parse(req.url).path, function (err, files) {
            if (err) {
                res.write(500)
            } else {
                var content = "<!DOCTYPE html><html><head lang='en'><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1'><style>html, body {  position: absolute;  top: 0;  left: 0;  right: 0;  bottom: 0;  margin: 0;  }  a { color: blue; display: inline-block;text-decoration: none;  margin: 10px 5px; }</style></head><body>";
                for (var i = 0; i < files.length; i++) {
                    var path = url.parse(req.url).path == "/" ? "" : url.parse(req.url).path;
                    content += "<div><a href='" + path + "/" + files[i] + "'>" + files[i] + "</a></div>"
                }
                content += "</body></html>";
                res.write(content);
            }
            res.end();
        });
    }
    console.log();
    // res.write(url.parse(req.url).toString());
    // res.end();
}).listen("9090", "");

