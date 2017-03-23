'use strict';

const proxyquire = require('proxyquire');
const chai = require('chai');
const sinon = require('sinon');
require('sinon-as-promised');

const expect = chai.expect;
chai.use(require('chai-http'));
chai.use(require('sinon-chai'));

let app;

let sparkpost = {
  transmissions: {
    send: sinon.stub().resolves({})
  }
};

describe('SparkPost Node.js sample', () => {
  before(() => {
    app = proxyquire('../server', {
      'sparkpost': function() { return sparkpost; }
    });
  });

  describe('/', () => {
    it('GET should render the sample', done => {
      chai.request(app).get('/').end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
    });
  });

  describe('/send', () => {
    it('POST should send a message through SparkPost', (done) => {
      const emailAddr = 'roberta@example.com';
      chai.request(app).post('/send').send({email: emailAddr})
        .end((err, res) => {
          expect(sparkpost.transmissions.send).to.have.been.calledOnce;
          expect(sparkpost.transmissions.send.firstCall.args[0].recipients[0].address).to.equal(emailAddr);
          done();
        });
    });
  });
});

