const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

const should = chai.should();
chai.use(chaiHttp);
chai.use(require('chai-things'));
chai.use(require('chai-like'));

let prefix = '/miits/api';
describe('Testing user endpoints', () => {

    it('should get all offers from pakkumised table', () => {
        chai.request(server)
            .get(`${prefix}/user/offers`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.should.all.have.property('id');
                res.body.should.all.have.property('feedback');
                res.body.should.all.have.property('title');
                res.body.should.deep.include({
                    id: 48,
                    favorite: false,
                    upcoming: false,
                    enterprise: 'Level',
                    title: 'Mimmer',
                    category: 'Drinks',
                    slug: 'Mimmer',
                    location: 'Tartu',
                    date: '06.20.2022',
                    price: 55,
                    image: 'image/url/litter.jpg',
                    description: 'heaviest, richest drink in town!',
                    reg_konto_fk: 1,
                    feedback: [{ tagasiside_id: 17, name: 'Allu', comment: 'asdasdasdasd', pakkumised_fk: 48}]
                });
            });
    });

    it('should get a single offer', () => {
        chai.request(server)
            .get(`${prefix}/user/offers/offer-details/Mimmer`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('id', 48);
                res.body.should.have.property('title', 'Mimmer');
                res.body.should.have.property('reg_konto_fk', 1);
            });
    });

    it('should create a new offer specific feedback in the tagasiside table', () => {
        chai.request(server)
            .post(`${prefix}/user/feedback/Strimmer`)
            .send({ name: 'Martin', comment: 'Mega pidu!'})
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('tagasiside_id');
                res.body.should.have.property('name', 'Martin');
                res.body.should.have.property('comment', 'Mega pidu!');
            });
    });
});