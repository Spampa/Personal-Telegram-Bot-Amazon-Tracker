const pool = require('../db/pool');

async function getMessage(chat){
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query(`SELECT * FROM messages WHERE chat_id = ?`, [chat]);
        return rows[0];
    }
    catch(err){
        throw err;
    }
    finally{
        if(conn) conn.end();
    }
}

async function addMessage(message){
    let conn;
    try{
        conn = await pool.getConnection();
        const sendTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const rows = await conn.query(`INSERT INTO messages (chat_id, message, send_time) VALUES (?, ?, ?)`, [message.chat, message.text, sendTime ]);
        return rows;
    }
    catch(err){
        throw err;
    }
    finally{
        if(conn) conn.end();
    }
}

async function updateMessage(message, chat){
    let conn;
    try{
        conn = await pool.getConnection();
        const sendTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const rows = await conn.query(`UPDATE messages SET message = ?, send_time = ? WHERE chat_id = ?`, [message.text, sendTime, chat]);
        return rows;
    }
    catch(err){
        console.log(err);
        throw err;
    }
    finally{
        if(conn) conn.end();
    }
}

module.exports = {
    getMessage,
    addMessage,
    updateMessage
}