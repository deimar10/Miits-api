const express = require('express');
const app = express();
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger.json');
const cors = require('cors');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

app.use('/miits/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(cors());

const enterpriseRouter = require('./routes/enterprise/enterprise.js');
const userRouter = require('./routes/user/user.js');

app.use(bodyParser.json());
app.use("/miits/api", enterpriseRouter, userRouter);

const port = process.env.PORT || 3002;
app.listen(3002, () => console.log(`Server started on port: ${port}`));

module.exports = app;
