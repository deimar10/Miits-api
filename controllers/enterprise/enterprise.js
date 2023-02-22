const {sanitizeInput, checkDateFormat} = require('../../utils/index');
const db = require('../../models/db');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const {password, username} = req.body;
        const isNameRegistered = await db.query('SELECT ettevõtte_nimi FROM reg_kontod WHERE ettevõtte_nimi = ?', [username]);

        if (!password || !username) {
            throw Error('Empty user input error');
        }

        if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
            throw Error('Password validation error');
        }

        if (isNameRegistered[0]) {
            throw Error('Name already taken');
        }

        const saltPassword = await bcrypt.genSalt(5);
        const securePassword = await bcrypt.hash(password, saltPassword);

        await db.query('INSERT INTO `reg_kontod` (`ettevõtte_nimi`, `salasõna`) VALUES (?,?)',
            [username, securePassword]);

        return res.status(200).send();

    } catch (error) {
        console.log(`${error}`);
        return res.status(400).send();
    }
}

exports.login = async (req, res) => {
    try {
        const {password, username} = req.body;
        const registeredPassword = await db.query('SELECT salasõna FROM reg_kontod WHERE ettevõtte_nimi = ?', [username]);

        bcrypt.compare(password, registeredPassword[0].salasõna, (err, data) => {
            if (err) throw Error;
            if (!data) {
                return res.status(401).json({auth: false});
            }

            res.status(200).json({auth: true});
        });

    } catch (error) {
        console.log(`Error authenticating enterprise login input: ${error}`);
        return res.status(400).send();
    }
}

exports.getOffers = async (req, res) => {
    try {
        let {enterprise} = req.query;

        const regEnterpriseId = await db.query('SELECT reg_konto_id FROM reg_kontod WHERE ettevõtte_nimi = ?',
            [enterprise]);

        const enterpriseOffers = await db.query('SELECT * FROM pakkumised WHERE reg_konto_fk = ?',
            [regEnterpriseId[0].reg_konto_id]);

        let offers = await assignFeedbackToOffer(enterpriseOffers);

        offers = offers.map((offer) => {
            return {...offer, upcoming: false, favorite: false}
        })

        return res.status(200).json(offers);

    } catch (error) {
        console.log(`Error trying to get enterprise offers: ${error}`);
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

exports.createOffer = async (req, res) => {
    try {
        const {
            upcoming, favorite, enterprise, title, category,
            location,
            date,
            price,
            image,
            description
        } = sanitizeInput(req.body);

        let isCorrectFormat = checkDateFormat(date);

        if (!isCorrectFormat) {
            throw Error('Incorrect date Format');
        }

        let slug = title;
        const regEnterpriseId = await db.query('SELECT reg_konto_id FROM reg_kontod WHERE ettevõtte_nimi = ?', [enterprise]);

        const result = await db.query(
            'INSERT INTO `pakkumised` (`upcoming`, `favorite`, `enterprise`, `title`, `category`, `slug`, `location`, `date`, `price`, `image`, `description`, `reg_konto_fk`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', [
                upcoming, favorite, enterprise, title, category, slug, location, date, price, image, description, regEnterpriseId[0].reg_konto_id
            ]);

        if (result.affectedRows) {
            return res.status(201).json({
                pakkumised_id: result.insertId,
                upcoming: upcoming,
                favorite: favorite,
                enterprise: enterprise,
                title: title,
                category: category,
                location: location,
                slug: slug,
                date: date,
                price: price,
                image: image,
                description: description,
                feedback: []
            });
        }

    } catch (error) {
        console.log(`Error trying to create new offer: ${error}`);
        return res.status(400).send();
    }
}

exports.editOffer = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            title, location, date,
            price,
            description,
            category
        } = sanitizeInput(req.body);

        let isCorrectFormat = checkDateFormat(date);

        if (!isCorrectFormat) {
            throw Error('Incorrect date Format');
        }

        await db.query('UPDATE pakkumised SET title = ?, location = ?, date = ?, price = ?, description = ?, category = ? WHERE pakkumised_id = ?',
            [title, location, date, price, description, category, id]);

        return res.status(200).send();

    } catch (error) {
        console.log(`Error trying to edit offer: ${error}`);
        return res.status(400).send();
    }
}

exports.deleteOffer = async (req, res) => {
    try {
        const id = req.params.id;
        await db.query('DELETE FROM pakkumised WHERE pakkumised_id = ?', [id]);

        return res.status(204).send();

    } catch (error) {
        console.log(`Error trying to delete offer: ${error}`);
        return res.status(400).send();
    }
}
