const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

app.use(cors());

const enterpriseRouter = require('./routes/enterprise/enterprise.js');

app.use(bodyParser.json());
app.use("/miits/api", enterpriseRouter);

const port = process.env.PORT || 3002;
app.listen(3002, () => console.log(`Server started on port: ${port}`));
