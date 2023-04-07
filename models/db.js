const mysql = require('mysql2/promise');
const dbConfig = require('./config');

async function query(sql, params) {
    const connection = await mysql.createConnection(dbConfig.db);
    const [result] = await connection.execute(sql, params);

    connection.end();

    return result;
}

module.exports = {
    query
}
