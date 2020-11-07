import 'mocha';
import app from '../lib/app';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

describe('Hello World API Request', () => {
  it('should return 200 code', async () => {
    return chai
      .request(app)
      .get('/')
      .then(res => {
        chai.expect(res.status).to.eql(200);
      });
  });
  it('should return hello world on call', async () => {
    return chai
      .request(app)
      .get('/')
      .then(res => {
        chai.expect(res.text).to.eql('Hello World');
      });
  });
});