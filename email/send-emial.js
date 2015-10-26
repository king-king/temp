/**
 * Created by WQ on 2015/10/26.
 */


var nodemailer = require( "nodemailer" );
// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport( {
    service : "QQ" , // 主机
    auth : {
        user : "1657030670@qq.com" , // 账号
        pass : "cs2//////" // 密码
    }
} );

// 设置邮件内容
var mailOptions = {
    from : "wq <1657030670@qq.com>" , // 发件地址
    to : "1657030670@qq.com,niuyiwangqun@sohu.com" , // 收件列表
    subject : "花火的测试邮件，请忽略" , // 标题
    html : " 你好，我是花火！<a href='http://www.baidu.com'>点击此链接可访问百度</a>" // html 内容
};

// 发送邮件
smtpTransport.sendMail( mailOptions , function ( error , info ) {
    if ( error ) {
        console.log( error );
    } else {
        console.log( "Message sent: " + info.response );
    }
    smtpTransport.close(); // 如果没用，关闭连接池
} );