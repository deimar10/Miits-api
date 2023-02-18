const db = require('../../models/db');

exports.getOffers = async (req, res) => {
  try {
      const userOffers = await db.query('SELECT * FROM pakkumised');

      let offers = await assignFeedbackToOffer(userOffers);

      offers = offers.map((offer) => {
          return {...offer, upcoming: false, favorite: false}
      })

      return res.status(200).send(offers);

  } catch (error) {
    console.log(`Error trying to get user offers: ${error}`);
    return res.status(400).send();
  }
}

async function assignFeedbackToOffer(offers) {
    let feedback;

    for (let offer of offers) {
        feedback = await db.query('SELECT * FROM tagasiside WHERE pakkumised_fk = ?', [offer.pakkumised_id]);
        offer.feedback = feedback;
    }
    return offers;
}