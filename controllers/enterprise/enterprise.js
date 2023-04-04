const { sanitizeInput, checkDateFormat, assignFeedbackToOffer } = require('../../utils/index');
const db = require('../../models/db');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

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

        await db.query('INSERT INTO `reg_kontod` (`ettevõtte_nimi`, `salasõna`, `kuupäev`) VALUES (?,?,?)',
            [username, securePassword, formattedDate]);

        return res.status(201).send();

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

            switch (username) {
                case 'Admin':
                    res.status(201).json({admin: true});
                    break;
                default:
                    res.status(201).json({auth: true});
                    break;
            }
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
                id: result.insertId,
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

        await db.query('UPDATE pakkumised SET title = ?, location = ?, date = ?, price = ?, description = ?, category = ? WHERE id = ?',
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
        await db.query('DELETE FROM pakkumised WHERE id = ?', [id]);

        return res.status(204).send();

    } catch (error) {
        console.log(`Error trying to delete offer: ${error}`);
        return res.status(400).send();
    }
}

exports.getOffersCount = async (req, res) => {
    try {
        const enterprise = req.params.enterprise;
        const result = await db.query('SELECT COUNT(*) as count FROM pakkumised WHERE enterprise = ?', [enterprise]);

        return res.status(200).json(result[0]);

    } catch (error) {
        console.log(`Error trying to get offer count: ${error}`);
        return res.status(400).send();
    }
}

exports.getRegistered = async (req, res) => {
    try {
        let registered = [];

        const result = await db.query('SELECT * FROM reg_kontod');

        result.forEach(obj => {
            if (obj.ettevõtte_nimi !== 'Admin') { registered.push({
                id: obj.reg_konto_id,
                name: obj.ettevõtte_nimi,
                joined_at: obj.kuupäev
            });
            }
        });

        return res.status(200).json(registered);

    } catch (error) {
        console.log(`Error trying to get registered enterprise: ${error}`);
        return res.status(400).send();
    }
}
