const pool = require('../db/pool');

async function addUserProduct(product) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('INSERT INTO user_products (chat_id, link) VALUES (?, ?)', [product.chat, product.link]);
        return rows[0];
    }
    catch (err) {
        if(err.errno === 1062){
            return {
                code: 409,
                error: "Duplicate entry"
            }
        }
        throw err;
    }
    finally {
        if (conn) conn.end();
    }
}

async function getUserProducts() {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query(`SELECT * FROM user_products`);
    }
    catch (err) {
        throw err;
    }
    finally {
        if (conn) conn.end();
    }
}

module.exports = {
    addUserProduct,
    getUserProducts
}