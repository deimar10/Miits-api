require('dotenv').config();

const config = {
    connectionLimit: 250,
    wait_timeout: 3,
    db: {
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    }
}

module.exports = config;
