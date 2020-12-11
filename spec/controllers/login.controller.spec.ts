import 'mocha';
import chai from 'chai';
import app from '../../lib/app';
import chaiHttp from 'chai-http';
import faker from 'faker';
import { user_role_0 as user } from '../spec_helper';
import { UserService } from '../../lib/services/user.service';

chai.use(chaiHttp);

let refreshToken = '';

describe('LoginController', () => {
  const userService: UserService = UserService.getInstance();
  let userId = '';

  describe('#createJWT', () => {

    before(async () => {
      //must happen to create a deep copy
      const toInsert = JSON.parse(JSON.stringify(user));
      await userService.create(toInsert).then((id) => {
        userId = id;
      });
    });

    after(async () => {
      //Need to wait for the promise
      await userService.deleteById(userId);
    });

    it('should return the 200 OK code', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: user.email, password: user.password })
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the accessToken field', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: user.email, password: user.password })
        .then(res => {
          refreshToken = res.body.refreshToken;
          chai.expect(res.body).to.have.property('accessToken');
        });
    });

    it('should return the refreshToken field', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: user.email, password: user.password })
        .then(res => {
          chai.expect(res.body).to.have.property('refreshToken');
        });
    });

    it('should return the 401 HTTP code, mismatching password', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: user.email, password: faker.lorem.text() })
        .then(res => {
          chai.expect(res.status).to.eql(401);
        });
    });

    it('should return the 401 HTTP code, mismatching email', async () => {
      return chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: faker.internet.email(), password: user.password })
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
        .send({ email: user.email})
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