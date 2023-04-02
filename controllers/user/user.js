const { sanitizeInput, assignFeedbackToOffer } = require('../../utils/index');
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

exports.getSingleOffer = async (req, res) => {
    try {
        const offerTitle = req.params.title;

        const offerByTitle = await db.query('SELECT * FROM pakkumised WHERE title = ?', [offerTitle]);
        const offer = await assignFeedbackToOffer(offerByTitle);

        return res.status(200).json(offer[0]);

    } catch (error) {
        console.log(`Error trying to get single offer: ${error}`);
        return res.status(400).send();
    }
}

exports.getLocations = async (req, res) => {
    try {
        let locations = [];

        const result = await db.query('SELECT location FROM pakkumised');

        result.forEach(obj => {
            if (!locations.includes(obj.location)) {
                locations.push(obj.location);
            }
        });

        return res.status(200).json(locations);

    } catch (error) {
        console.log(`Error trying to get offer locations: ${error}`);
        return res.status(400).send();
    }
}

exports.createUserFeedback = async (req, res) => {
    try {
        const offerTitle = req.params.title;
        const { name, comment } = sanitizeInput(req.body);

        const offerId = await db.query('SELECT id FROM pakkumised WHERE title = ?', [offerTitle]);

        const result = await db.query('INSERT INTO tagasiside ( `name`, `comment`, `pakkumised_fk`) VALUES (?,?,?)',
            [name, comment, offerId[0].id]);

        if (result.affectedRows) {
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
