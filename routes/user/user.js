const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user/user.js');

router.get('/user/offers', userController.getOffers);
router.post('/user/feedback/:title', userController.createUserFeedback);

module.exports = router;
