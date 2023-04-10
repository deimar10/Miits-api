const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

const should = chai.should();
chai.use(chaiHttp);
chai.use(require('chai-things'));
chai.use(require('chai-like'));

let prefix = '/miits/api';
let offerId;
describe('Testing enterprise endpoints', () => {

    it('should successfully register an enterprise', (done) => {
        chai.request(server)
            .post(`${prefix}/enterprise/register`)
            .send({ username: 'Rüütli', password: 'Lollakas1!'})
            .end((err, res) => {
                res.should.have.status(201);
                done();
        });
    });

    it('should throw empty input error during registration', () => {
        chai.request(server)
            .post(`${prefix}/enterprise/register`)
            .send( {username: '', password: ''})
            .end((err, res) => {
                res.should.have.status(400);
                res.error.message.should.be.a('string', 'Error: Empty user input error');
        });
    });

    it('should throw name already taken error during registration', () => {
        chai.request(server)
            .post(`${prefix}/enterprise/register`)
            .send( { username: 'Shooters', password: 'Madistame123!' })
            .end((err, res) => {
                res.should.have.status(400);
                res.error.message.should.be.a('string', 'Error: Name already taken');
            });
    });

    it('should throw password validation error during', () => {
        chai.request(server)
            .post(`${prefix}/enterprise/register`)
            .send( { username: 'Up', password: 'Lollakas' })
            .end((err, res) => {
                res.should.have.status(400);
                res.error.message.should.be.a('string', 'Error: Password validatio');
            });
    });

    it('should successfully .auth enterprise', (done) => {
        chai.request(server)
            .post(`${prefix}/enterprise/login`)
            .send({ username: 'Rüütli', password: 'Lollakas1!' })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('auth', true);
                done();
            });
    });

    it('should fail to .auth enterprise', () => {
        chai.request(server)
            .post(`${prefix}/enterprise/login`)
            .send({ username: 'Rüütli', password: 'Lollak' })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an('object');
                res.body.should.have.property('auth', false);
            });
    });

    it('should successfully get all enterprise specific offers', () => {
        chai.request(server)
            .get(`${prefix}/enterprise/offers/?enterprise=Shooters`)
            .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.an('array').lengthOf(3);
            });
    });

    it('should successfully create a new offer', (done) => {
        chai.request(server)
            .post(`${prefix}/enterprise/offer/create`)
            .send({
                upcoming: false,
                favorite: false,
                enterprise: 'KolmTilli',
                title: 'UusAlgus',
                category: 'Event',
                location: 'Tallinn',
                date: '06.20.2023',
                price: 49.99,
                image: 'image/event/uusAlgus.jpg',
                description: 'Vinge aastavahetuse pidu!'
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.a.property('id');
                res.body.should.have.a.property('title', 'UusAlgus');
                res.body.should.have.a.property('enterprise', 'KolmTilli');
                res.body.should.have.a.property('price', 49.99);
                offerId = res.body.id;
                done();
            });
    });

    it('should fail to create a new offer', () => {
        chai.request(server)
            .post(`${prefix}/enterprise/offer/create`)
            .send({
                upcoming: false,
                favorite: false,
                enterprise: 'KolmTilli',
                title: 'UusAlgus',
                category: 'Event',
                location: 'Tallinn',
                date: '06/20/2023',
                price: 49.99,
                image: 'image/event/uusAlgus.jpg',
                description: 'Vinge aastavahetuse pidu!'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.error.message.should.be.a('string', 'Error: Incorrect date format');
            });
    });

    it('should successfully edit an enterprise offer', () => {
        chai.request(server)
            .put(`${prefix}/enterprise/offer/edit/${offerId}`)
            .send({
                title: 'MetsikMõll',
                location: 'Tallinn',
                date: '06.20.2023',
                price: 49.99,
                description: 'Vinge aastavahetuse pidu!',
                category: 'Event'
            })
            .end((err, res) => {
                res.should.have.status(200);
            });
    });

    it('should successfully delete an enterprise offer', () => {
        chai.request(server)
            .delete(`${prefix}/enterprise/offer/delete/${offerId}`)
            .end((err, res) => {
                res.should.have.status(204);
            });
    });

    it('should successfully get the count of enterprise offers', () => {
        chai.request(server)
            .get(`${prefix}/enterprise/offers/Level/count`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('count', 2);
            });
    });

    it('should successfully get all registered accounts except admin', () => {
        chai.request(server)
            .get(`${prefix}/enterprise/registered`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.length.should.be.above(7);
                res.body.should.not.have.deep.property('name', 'admin');
            });
    });
});