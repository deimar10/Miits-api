const db = require('../../models/db');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { password, username } = req.body;

    if (!password || !username) { throw Error('Empty user input error'); }

    if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) { throw Error('Password validation error'); }

    const saltPassword = await bcrypt.genSalt(5);
    const securePassword = await bcrypt.hash(password, saltPassword);

    await db.query('INSERT INTO `reg_kontod` (`ettevõtte_nimi`, `salasõna`) VALUES (?,?)',
        [username, securePassword]);

    return res.status(200).send();

  } catch (error) {
    console.log(`Error inserting enterprise register data: ${error}`);
    return res.status(400).send();
  }
}
