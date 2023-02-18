const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user/user.js');

router.get('/user/offers', userController.getOffers);

module.exports = router;