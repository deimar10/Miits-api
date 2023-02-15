const db = require('../../models/db');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { password, username } = req.body;
    const isNameRegistered = await db.query('SELECT ettevõtte_nimi FROM reg_kontod WHERE ettevõtte_nimi = ?', [username]);

    if (!password || !username) { throw Error('Empty user input error'); }

    if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) { throw Error('Password validation error'); }

    if (isNameRegistered[0]) { throw Error('Name already taken'); }

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
    const { password, username } = req.body;
    const registeredPassword = await db.query('SELECT salasõna FROM reg_kontod WHERE ettevõtte_nimi = ?', [username]);

    bcrypt.compare(password, registeredPassword[0].salasõna, (err, data) => {
      if (err) throw Error;
      if (!data) { return res.status(401).json({auth: false}); }

      res.status(200).json({auth: true});
    });

  } catch (error) {
    console.log(`Error authenticating enterprise login input: ${error}`);
    return res.status(400).send();
  }
}
