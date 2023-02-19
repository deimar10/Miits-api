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

exports.createUserFeedback = async (req, res) => {
    try {
        const offerTitle = req.params.title;
        const { name, comment } = req.body;

        const offerId = await db.query('SELECT pakkumised_id FROM pakkumised WHERE title = ?', [offerTitle]);

        const result = await db.query('INSERT INTO tagasiside ( `name`, `comment`, `pakkumised_fk`) VALUES (?,?,?)',
            [name, comment, offerId[0].pakkumised_id]);

        if(result.affectedRows) {
            return res.status(201).json({
                tagasiside_id: result.insertId,
                name: name,
                comment: comment
            });
        }

    } catch (error) {
      console.log(`Error trying to create user feedback: ${error}`);
      return res.status(400).send();
    }
}
