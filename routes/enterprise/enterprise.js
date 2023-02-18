const express = require('express');
const router = express.Router();

const enterpriseController = require('../../controllers/enterprise/enterprise.js');

router.post('/enterprise/register', enterpriseController.register);
router.post('/enterprise/login', enterpriseController.login);
router.get('/enterprise/offers', enterpriseController.getOffers);
router.post('/enterprise/offer/create', enterpriseController.createOffer);
router.put('/enterprise/offer/edit/:id', enterpriseController.editOffer);
router.delete('/enterprise/offer/delete/:id', enterpriseController.deleteOffer);

module.exports = router;
