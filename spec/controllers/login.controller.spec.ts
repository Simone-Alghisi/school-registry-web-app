import 'mocha';
import chai from 'chai';
import app from '../../lib/app';
import chaiHttp from 'chai-http';
import faker from 'faker';
import { UserController } from '../../lib/controllers/user.controller';
import moment from 'moment';

chai.use(chaiHttp);

const email: string = faker.internet.email();
const password: string = 'veryWeakPassw0rd!';
const dateFormat: string = 'YYYY-MM-DD';
let refreshToken:string = '';

describe('UserController', () => {
  const userController: UserController = new UserController();

  describe('#createJWT', () => {
    const user = {
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      password: password,
      email: email,
      role: 0,
      birth_date: moment(new Date()).format(dateFormat)
    }

    it('Default user created', async () => {
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .send(user)
        .then(res => {
          chai.expect(res.status).to.eql(201);
        });
    });

    it('should return the 200 OK code', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: email, password: password })
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the accessToken field', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: email, password: password })
        .then(res => {
          refreshToken = res.body.refreshToken;
          chai.expect(res.body).to.have.property('accessToken');
        });
    });

    it('should return the refreshToken field', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: email, password: password })
        .then(res => {
          chai.expect(res.body).to.have.property('refreshToken');
        });
    });

    it('should return the 401 HTTP code, mismatching password', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: email, password: faker.lorem.text() })
        .then(res => {
          chai.expect(res.status).to.eql(401);
        });
    });

    it('should return the 401 HTTP code, mismatching email', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: faker.internet.email(), password: password })
        .then(res => {
          chai.expect(res.status).to.eql(401);
        });
    });

    it('should return the 401 HTTP code, both of the field are wrong', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: faker.internet.email(), password: faker.lorem.text() })
        .then(res => {
          chai.expect(res.status).to.eql(401);
        });
    });

    it('should return the 401 HTTP code, missing a field', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: email})
        .then(res => {
          chai.expect(res.status).to.eql(401);
        });
    });

    it('should return the 401 HTTP code, empty body', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(401);
        });
    });
  });

  describe('#refreshJWT', () => {
    it('should return the 200 OK code', async () => {
      return chai
        .request(app)
        .post('/api/v1/login/refresh')
        .send({ refreshToken: refreshToken })
        .then(res => {
          console.log(refreshToken);
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the accessToken field', async () => {
      return chai
        .request(app)
        .post('/api/v1/login/refresh')
        .send({ refreshToken: refreshToken })
        .then(res => {
          chai.expect(res.body).to.have.property('accessToken');
        });
    });

    it('should return the 401 HTTP code, missing refreshToken', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(401);
        });
    });
  });
});