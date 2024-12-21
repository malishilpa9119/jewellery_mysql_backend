const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

const mysql = require('mysql2');


const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,  
    connectionLimit: 10,      
    queueLimit: 0             
});


pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log(`${DB_NAME} Database connected successfully!`);
    connection.release();  
});

module.exports = pool;
