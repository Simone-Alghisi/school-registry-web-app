/**
 * Verifies if a newly created instance of {@link UserController} implements 
 * all the methods defined by the interface {@link CRUDController}.
 * It also verifies that the result of a get request to _/users_ responds
 * with status 200 OK, returning the same information stored in the database
 * @packageDocumentation
 */

import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../lib/app';
import { UserController } from '../../lib/controllers/user.controller';
import * as faker from 'faker';
import { User } from '../../lib/models/user.model'
import users from '../../lib/db/db'

chai.use(chaiHttp);

describe('UserController', () => {
  const userController: UserController = new UserController();

  describe('CRUD interface implementation', () => {
    it('should implement the list function', () => {
      return chai.expect(userController).to.have.property('list');
    });
    it('should implement the create function', () => {
      return chai.expect(userController).to.have.property('create');
    });
    it('should implement the updateById function', () => {
      return chai.expect(userController).to.have.property('updateById');
    });
    it('should implement the getById function', () => {
      return chai.expect(userController).to.have.property('getById');
    });
    it('should implement the deleteById function', () => {
      return chai.expect(userController).to.have.property('deleteById');
    });
  });

  describe('#list', () => {
    it('should return the 200 OK code', async () => {
    return chai
        .request(app)
        .get('/api/v1/users')
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the users json data in db', async () => {
      return chai
          .request(app)
          .get('/api/v1/users')
          .then(res => {
            chai.expect(res.body).to.eql(users);
          });
    });

    it('should be composed of 3 elements', async () => {
      return chai
          .request(app)
          .get('/api/v1/users')
          .then(res => {
            chai.expect(res.body).to.have.lengthOf(3);
          });
    });
  });

  describe('#create', async () => {
    const personName: string = faker.name.findName();
    const personSurname: string = faker.name.findName();
    const personEmail: string = faker.internet.email()
    const personPassword: string = faker.internet.password();
    const personId = 3;
    const personRole: number = faker.random.number({'min': 0, 'max': 2});
    const personBirth_day: string = faker.name.findName();
    const user: User = new User(personName, personSurname, personEmail, personPassword, personId, personRole, personBirth_day);
    
    it('should return the 201 status code', async () => {
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(user)
          .then(res => {
            chai.expect(res.status).to.eql(201);
          });
    });

    it('should create a new user, in json', async () => {
      return chai
          .request(app)
          .get('/api/v1/users')
          .then(res => {
            chai.expect(res.body).to.deep.include(user);
          });
    });

    it('should create a new user, element added', async () => {
      return chai
          .request(app)
          .get('/api/v1/users')
          .then(res => {
            chai.expect(res.body).to.have.lengthOf(4);
          });
    });

    it('should return the 422 status code: no body', async () => {
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send()
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: missing field', async () => {
      const fake_usr:object = {name: personName, surname: personSurname, email: personEmail, password: personPassword, role: personRole};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: empty name field', async () => {
      const fake_usr:object = {name: '', surname: personSurname, email: personEmail, password: personPassword, role: personRole, birth_date: personBirth_day};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: wrong type for name', async () => {
      const fake_usr:object = {name: 0, surname: personSurname, email: personEmail, password: personPassword, role: personRole, birth_date: personBirth_day};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: empty surname field', async () => {
      const fake_usr:object = {name: personName, surname: '', email: personEmail, password: personPassword, role: personRole, birth_date: personBirth_day};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: wrong type for surname', async () => {
      const fake_usr:object = {name: personName, surname: 0, email: personEmail, password: personPassword, role: personRole, birth_date: personBirth_day};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: empty email field', async () => {
      const fake_usr:object = {name: personName, surname: personSurname, email: '', password: personPassword, role: personRole, birth_date: personBirth_day};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: wrong type for email', async () => {
      const fake_usr:object = {name: personName, surname: personSurname, email: 0, password: personPassword, role: personRole, birth_date: personBirth_day};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: empty password field', async () => {
      const fake_usr:object = {name: personName, surname: personSurname, email: personEmail, password: '', role: personRole, birth_date: personBirth_day};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: wrong type for password', async () => {
      const fake_usr:object = {name: personName, surname: personSurname, email: personEmail, password: 0, role: personRole, birth_date: personBirth_day};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: empty role field', async () => {
      const fake_usr:object = {name: personName, surname: personSurname, email: personEmail, password: personPassword, role: '', birth_date: personBirth_day};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: wrong type for role', async () => {
      const fake_usr:object = {name: personName, surname: personSurname, email: personEmail, password: personPassword, role: 'hello world', birth_date: personBirth_day};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: empty birth_date field', async () => {
      const fake_usr:object = {name: personName, surname: personSurname, email: personEmail, password: personPassword, role: personRole, birth_date: ''};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });

    it('should return the 422 status code: wrong type for birth_date', async () => {
      const fake_usr:object = {name: personName, surname: personSurname, email: personEmail, password: personPassword, role: personRole, birth_date: 0};
      return chai
          .request(app)
          .post('/api/v1/users')
          .set('content-type', 'application/json')
          .send(fake_usr)
          .then(res => {
            chai.expect(res.status).to.eql(422);
          });
    });
  });
});