'use strict'
const Wechat = require('wechat4u')
const qrcode = require('qrcode-terminal')

let bot = new Wechat()

let ToUserName = null;
let tar = '装逼协会';

bot.on('error', err => {
    console.log('错误：', err)
})

bot.on('uuid', uuid => {
    // uuid事件，获取二维码
    qrcode.generate('https://login.weixin.qq.com/l/' + uuid, {
    })
    console.log('二维码链接：', 'https://login.weixin.qq.com/qrcode/' + uuid)
})

function tuning(word) {
    let params = {
        'key': '2ba083ae9f0016664dfb7ed80ba4ffa0',
        'info': word
    };
    return bot.request({
        method: 'GET',
        url: 'http://www.tuling123.com/openapi/api',
        params: params
    }).then(res => {
        const data = res.data;
        if (data.code == 100000) {
            return data.text; // + '[微信机器人]';
        }
        throw new Error('tuning返回值code错误', data);
    }).catch(err => {
        console.log(err);
        return '现在思路很乱，最好联系下我哥 T_T...';
    });
}

bot.on('login', () => {
    console.log('登录成功')
    ToUserName = bot.contacts['filehelper'].UserName
    for (var name in bot.contacts) {
        if (bot.contacts[name].NickName === tar) {
            ToUserName = bot.contacts[name].UserName
        }
    }

})

bot.on('logout', () => {
    console.log('登出成功')
})

bot.on('message', msg => {
    if (msg.FromUserName !== ToUserName || msg.MsgType !== 1) return;
    console.log('受到文本信息: ' + msg.Content);
    tuning(msg.Content).then(r => {
        setTimeout(function () {
          bot.sendMsg(r, ToUserName);
        }, 500);
    })
})

bot.start()
