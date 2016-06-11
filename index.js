//wechat middleware
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
app.set('port', (process.env.PORT || 5000));
app.use(express.query());
app.use('/', wechat(config).text(function (message, req, res, next) {
    request('http://sandbox.api.simsimi.com/request.p?key=8de56a1d-5367-41bc-a36a-4be3d46b5742&lc=zh&ft=1.0&text=' + encodeURIComponent(message.Content), function (err, response, data) {
        if(err || !JSON.parse(data).response){
            return res.reply({
                content: '机器人已经不堪重负挂掉了呢,请稍后再来调戏吧- -!',
                type: 'text'
            });
        }
        res.reply({
            content: JSON.parse(data).response,
            type: 'text'
        });
    })
}).image(function (message, req, res, next) {
    res.reply({
        content: '收到了一张图片: ' + util.inspect(message),
        type: 'text'
    });
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
