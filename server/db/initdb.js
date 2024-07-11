const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 5
});

async function createDataBase() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await createTables(conn);
        console.log('Database run correctly');
    }
    catch (e) {
        console.log('Error during creation of DB' + e);
    }
    finally {
        if (conn) return conn.end();
    }
}

async function createTables(conn) {
    try {
        conn.query(`
            CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.user_products(
                chat_id CHAR(16),
                link VARCHAR(255),
                PRIMARY KEY (chat_id, link)
            )
        `);

        conn.query(`
            CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.products(
                product_id CHAR(16) PRIMARY KEY,
                name TEXT NOT NULL
            )
        `);

        conn.query(`
            CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.products_data(
                tracked_time DATETIME,
                product CHAR(16),
                price TEXT NOT NULL,
                standard_price TEXT NOT NULL,
                discount INT(4),
                currency TEXT,
                CONSTRAINT fk_product FOREIGN KEY (product) REFERENCES products(product_id) ON DELETE CASCADE,
                PRIMARY KEY (tracked_time, product)
            )
        `);
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = createDataBase