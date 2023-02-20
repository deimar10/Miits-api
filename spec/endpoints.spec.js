const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

const should = chai.should();
chai.use(chaiHttp);
chai.use(require('chai-things'));
chai.use(require('chai-like'));