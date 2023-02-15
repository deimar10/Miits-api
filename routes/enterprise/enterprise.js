const express = require('express');
const router = express.Router();

const enterpriseController = require('../../controllers/enterprise/enterprise.js');

router.post('/enterprise/register', enterpriseController.register);
router.post('/enterprise/login', enterpriseController.login);
router.post('/enterprise/offer/create', enterpriseController.createOffer);

module.exports = router;
