const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user/user.js');

router.get('/user/offers', userController.getOffers);
router.get('/user/offers/offer-details/:title', userController.getSingleOffer);
router.post('/user/feedback/:title', userController.createUserFeedback);

module.exports = router;
