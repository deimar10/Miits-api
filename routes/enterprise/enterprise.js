const express = require('express');
const router = express.Router();

const enterpriseController = require('../../controllers/enterprise/enterprise.js');
const {authenticate, authorize} = require('../../middleware/auth');

router.post('/enterprise/register', enterpriseController.register);
router.post('/enterprise/login', enterpriseController.login);
router.post('/enterprise/offer/create', authenticate, enterpriseController.createOffer);
router.get('/enterprise/offers', enterpriseController.getOffers);
router.get('/enterprise/offers/:enterprise/count', enterpriseController.getOffersCount);
router.get('/enterprise/registered', enterpriseController.getRegistered);
router.put('/enterprise/offer/edit/:id', [authenticate, authorize], enterpriseController.editOffer);
router.delete('/enterprise/offer/delete/:id', [authenticate, authorize], enterpriseController.deleteOffer);

module.exports = router;
