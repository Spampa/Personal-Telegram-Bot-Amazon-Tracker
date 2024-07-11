require('dotenv').config();
const axios = require('axios');
const io = require('socket.io-client');
const socket = io(process.env.SERVER_URL);

process.env.NTBA_FIX_350 = '1';
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});

let previousMessage = '';

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Hello! 👋

I'm your Amazon product tracking assistant. 🛒✨
        
📈 I can monitor your favorite items and detect price changes every 10 minutes. ⏱️
        
If you need help or want to start tracking a product, just let me know! 😊
        
Happy browsing and happy shopping! 🛍️`);
});

bot.onText(/\/add/, (msg, match) => {
    bot.sendMessage(msg.chat.id, 'Please send me the link of the product you want to track');
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if(previousMessage === '/add'){
        const link = messageText;
        axios.post(`${process.env.SERVER_URL}/v1/products`, {
            link: link,
            chat: chatId
        })
        .then(res => {
            bot.sendMessage(chatId, '✅ ' + 'Product added');
        })
        .catch(e => {
            const error = e.response.data;
           
            if(error.code === 409){
                bot.sendMessage(chatId, '⚠️ ' + 'Product already tracked');
            }
            else if(error.code === 400){
                bot.sendMessage(chatId, '⚠️ ' + 'Link not correct'); 
            }
        });
    }
    previousMessage = messageText;
});

socket.on('product', (data) => {
    const p = data.product;
    if(!data?.old){
        bot.sendPhoto(data.chat, data.image, {
            caption: `👉 ${p.name}\n\n💰 ${p.price+p.currency}\n🎯 ${p.standardPrice+p.currency}\n📉 -${p.discount}%\n\n (First Tracking)`,
            filename: `${p.id}.png`
        });
    }
    else{
        const o = data.old;
        bot.sendPhoto(data.chat, data.image, {
            caption: `👉 ${p.name}\n\n💰 ${p.price+p.currency}\n🎯 ${p.standardPrice+p.currency}\n📉 -${p.discount}%\n\n 🔙Old Tracking:\n💰 ${o.price+o.currency}\n🎯 ${o.standardPrice+o.currency}\n📉 -${o.discount}%\n\n`,
            filename: `${p.id}.png`
        });
    }
});