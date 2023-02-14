const express = require('express');
const router = express.Router();

const enterpriseController = require('../../controllers/enterprise/enterprise.js');

router.post('/enterprise/register', enterpriseController.register);
router.post('/enterprise/login', enterpriseController.login);

module.exports = router;
