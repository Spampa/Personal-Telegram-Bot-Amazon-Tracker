const pool = require('../db/pool');

async function addProduct(product) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('INSERT INTO products (product_id, name) VALUES (?, ?)', [product.id, product.name]);
        return rows;
    }
    catch (err) {
        throw err;
    }
    finally {
        if (conn) conn.end();
    }
}

async function getProduct(id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM products WHERE product_id = ?', [id]);
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
    addProduct,
    getProduct
}