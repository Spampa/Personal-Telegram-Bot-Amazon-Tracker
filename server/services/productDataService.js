const pool = require('../db/pool');

async function addDataProduct(data) {
    let conn;
    try {
        conn = await pool.getConnection();
        const trackedTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const rows = await conn.query('INSERT INTO products_data (tracked_time, product, price, standard_price, discount, currency) VALUES (?, ?, ?, ?, ?, ?)',
            [trackedTime, data.id, data.price, data.standardPrice, data.discount, data.currency]
        );
        return rows;
    }
    catch (err) {
        throw err;
    }
    finally {
        if (conn) conn.end();
    }
}

async function getDataProduct(filter) {
}

async function getLastDataProduct(id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
                SELECT * FROM products_data
                WHERE product = ?
                ORDER BY tracked_time DESC
                LIMIT 1 
            `, 
            [id]
        );
        return rows[0];
    }
    catch (err) {
        throw err;
    }
    finally {
        if (conn) conn.end();
    }
}

module.exports = {
    addDataProduct,
    getDataProduct,
    getLastDataProduct
}