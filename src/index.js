//wechat middleware
require("babel-core/register");
//require("babel-polyfill");

var express = require('express');
var app = express();
var util = require('util')
var wechat = require('wechat');
var request = require('request');
var config = {
    token: 'lifanfan',
    appid: 'wx104c9afe0e7b2afd',
    encodingAESKey: 'EKV54jq8DA8eE6FVgGPPgkDpOchGxZ0A4iP1RYlH8KI'
};
import speech from './api/speech'
import pic from './api/pic'
import wx from './api/wx'
//pic.upload('http://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/crop%3D0%2C0%2C599%2C400%3Bc0%3Dbaike80%2C5%2C5%2C80%2C26/sign=25db9bfaff36afc31a4365258e29c7f4/dbb44aed2e738bd49588640ba98b87d6277ff95b.jpg')
//    .then(url => pic.addAvatar(url))
//    .then(url => console.log(url))

app.set('port', (process.env.PORT || 5000));
app.use(express.query());
app.use('/', wechat(config).text(async function (message, req, res, next) {
    //let data = await speech.toVoice(message.Content)
    //res.reply({
    //    content: data,
    //    type: 'voice'
    //})
    //const uid = req.weixin.FromUserName
    //
    //console.log(1234)
    //wx.getAvatar(uid)

    request('http://api.qingyunke.com/api.php?key=free&appid=0&msg=' + encodeURIComponent(message.Content), function (err, response, data) {

        if(err || !JSON.parse(data).content){
            return res.reply({
                content: '机器人已经不堪重负挂掉了呢,请稍后再来调戏吧- -!',
                type: 'text'
            });
        }
        res.reply({
            content: JSON.parse(data).content
                .replace(/菲菲/g, '李饭饭')
                .replace(/\{br\}/g, '\n'),
            type: 'text'
        });
    })
}).image(function (message, req, res, next) {
    const picUrl = message.PicUrl
    console.log(picUrl)

    pic.upload(picUrl)
        .then(url => pic.addAvatar(url))
        //.then(url => pic.upload(url))
        .then(url => {
            res.reply({
                content: '圣诞头像: ' + url,
                type: 'text'
            });
        })

}).voice(function (message, req, res, next) {
    res.reply({
        content: util.inspect(message),
        type: 'text'
    });
}).video(function (message, req, res, next) {
    res.reply({
        content: '暂时还不支持视频消息哦~',
        type: 'text'
    });
}).location(function (message, req, res, next) {
    res.reply({
        content: '暂时还不支持定位消息哦~',
        type: 'text'
    });
}).link(function (message, req, res, next) {
    res.reply({
        content: '暂时还不支持链接消息哦~',
        type: 'text'
    });
}).event(function (message, req, res, next) {
    if(message.Event === 'subscribe') {
        res.reply({
            content: '欢迎关注李饭饭的微信公众号,直接回复任何消息即可与我互动,快来调戏我吧~',
            type: 'text'
        });
    }
}).device_text(function (message, req, res, next) {
    res.reply({
        content: '暂时还不支持该类型的消息哦~',
        type: 'text'
    });
}).device_event(function (message, req, res, next) {
    res.reply({
        content: '暂时还不支持该类型的消息哦~',
        type: 'text'
    });
}).middlewarify());
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
})
