const express = require('express');
const app = express()

const dotenv = require('dotenv');
dotenv.config()

const port = process.env.PORT || 3002;
app.listen(3002, () => {
    console.log(`Server started on port: ${port}`);
});
