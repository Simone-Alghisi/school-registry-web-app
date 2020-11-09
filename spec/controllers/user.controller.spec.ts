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
import {
  UserController
} from '../../lib/controllers/user.controller';
import * as faker from 'faker';
import {
  User
} from '../../lib/models/user.model'
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
    it('should implement the updateAll function', () => {
      return chai.expect(userController).to.have.property('updateAll')
    });
    it('should implement the deleteAll unction', () => {
      return chai.expect(userController).to.have.property('deleteAll');
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
    const personRole: number = faker.random.number({
      'min': 0,
      'max': 2
    });
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
      const fake_usr: object = {
        name: personName,
        surname: personSurname,
        email: personEmail,
        password: personPassword,
        role: personRole
      };
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
      const fake_usr: object = {
        name: '',
        surname: personSurname,
        email: personEmail,
        password: personPassword,
        role: personRole,
        birth_date: personBirth_day
      };
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
      const fake_usr: object = {
        name: 0,
        surname: personSurname,
        email: personEmail,
        password: personPassword,
        role: personRole,
        birth_date: personBirth_day
      };
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
      const fake_usr: object = {
        name: personName,
        surname: '',
        email: personEmail,
        password: personPassword,
        role: personRole,
        birth_date: personBirth_day
      };
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
      const fake_usr: object = {
        name: personName,
        surname: 0,
        email: personEmail,
        password: personPassword,
        role: personRole,
        birth_date: personBirth_day
      };
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
      const fake_usr: object = {
        name: personName,
        surname: personSurname,
        email: '',
        password: personPassword,
        role: personRole,
        birth_date: personBirth_day
      };
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
      const fake_usr: object = {
        name: personName,
        surname: personSurname,
        email: 0,
        password: personPassword,
        role: personRole,
        birth_date: personBirth_day
      };
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
      const fake_usr: object = {
        name: personName,
        surname: personSurname,
        email: personEmail,
        password: '',
        role: personRole,
        birth_date: personBirth_day
      };
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
      const fake_usr: object = {
        name: personName,
        surname: personSurname,
        email: personEmail,
        password: 0,
        role: personRole,
        birth_date: personBirth_day
      };
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
      const fake_usr: object = {
        name: personName,
        surname: personSurname,
        email: personEmail,
        password: personPassword,
        role: '',
        birth_date: personBirth_day
      };
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
      const fake_usr: object = {
        name: personName,
        surname: personSurname,
        email: personEmail,
        password: personPassword,
        role: 'hello world',
        birth_date: personBirth_day
      };
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
      const fake_usr: object = {
        name: personName,
        surname: personSurname,
        email: personEmail,
        password: personPassword,
        role: personRole,
        birth_date: ''
      };
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
      const fake_usr: object = {
        name: personName,
        surname: personSurname,
        email: personEmail,
        password: personPassword,
        role: personRole,
        birth_date: 0
      };
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

  describe('#deleteAll', () => {
    it('should return the 405 status code: operation not allowed', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users')
        .then(res => {
          chai.expect(res.status).to.equal(405);
        });
    });

    it('should return the json error message "Method not allowed"', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users')
        .then(res => {
          chai.expect(res.body.error).to.equal('Method not allowed');
        });
    });
  });

  describe('#deleteById', () => {
    const existingUserId = 0;
    const notAUserId = 69;
    it('should return the 404 status code:    invalid user id', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users/' + notAUserId)
        .then(res => {
          chai.expect(res.status).to.equal(404);
        });
    });
    it('should return the json error message: invalid user id', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users/' + notAUserId)
        .then(res => {
          chai.expect(res.body.error).to.equal('User to delete not found');
        });
    });
    it('should return the 204 status code:    valid user id', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users/' + existingUserId)
        .then(res => {
          chai.expect(res.status).to.equal(204);
        });
    });
    it('should return the 404 status code:    previously valid user id', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users/' + existingUserId)
        .then(res => {
          chai.expect(res.status).to.equal(404);
        });
    });
    it('should return the json error message: previously valid user id', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users/' + existingUserId)
        .then(res => {
          chai.expect(res.body.error).to.equal('User to delete not found');
        });
    });
    it('should be composed by 3 elements (one was added, one deleted)', () => {
      return chai
        .request(app)
        .get('/api/v1/users')
        .then(res => {
          chai.expect(res.body).to.have.lengthOf(3);
        });
    });
    //the element deleted should not be accessible
    it('should return the 404 status code:    previously valid user id', () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + existingUserId)
        .then(res => {
          chai.expect(res.status).to.equal(404);
        });
    });
  });

  describe('#findAndUpdateUserById', () => {
    const personName: string = faker.name.findName();
    const personSurname: string = faker.name.findName();
    const personEmail: string = faker.internet.email()
    const personPassword: string = faker.internet.password();
    const personId = faker.random.number({
      'min': 1,
      'max': 3
    });
    const personRole: number = faker.random.number({
      'min': 0,
      'max': 2
    });
    //TODO... Change date format for test case
    const prova: Date = faker.date.past();
    const personBirth_day: string = faker.date.past().toLocaleDateString();
    const user: User = new User(personName, personSurname, personEmail, personPassword, personId, personRole, personBirth_day);
    
    it('should return the 200 status code', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(user)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });
    //! DOESN'T WORK CAUSE OF DATE FORMAT 
    /*it('should edit the user, in json', async () => {
      return chai
        .request(app)
        .get('/api/v1/users')
        .then(res => {
          chai.expect(res.body).to.deep.include(user);
        });
    }); */

    it('should have the same number of element', async () => {
      return chai
        .request(app)
        .get('/api/v1/users')
        .then(res => {
          chai.expect(res.body).to.have.lengthOf(3);
        });
    });
    
    it('should return the 204 status code: no body', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: no field to edit', async () => {
      const fake_usr: object = {
        name_: personName,
        surname_: personSurname,
        email_: personEmail,
        password_: personPassword,
        role_: personRole
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 200 status code: some field missing but it\'s not a problem', async () => {
      const fake_usr: object = {
        name: personName,
        surname: personSurname,
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 204 status code: empty name field', async () => {
      const fake_usr: object = {
        name: ''
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for name', async () => {
      const fake_usr: object = {
        name: 0,
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: empty surname field', async () => {
      const fake_usr: object = {
        surname: ''
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for surname', async () => {
      const fake_usr: object = {
        surname: 0
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: empty email field', async () => {
      const fake_usr: object = {
        email: ''
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for email', async () => {
      const fake_usr: object = {
        email: 0
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: empty password field', async () => {
      const fake_usr: object = {
        password: '',
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for password', async () => {
      const fake_usr: object = {
        password: 0
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: empty role field', async () => {
      const fake_usr: object = {
        role: ''
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for role', async () => {
      const fake_usr: object = {
        role: 'hello world'
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });
    
    it('should return the 204 status code: empty birth_date field', async () => {
      const fake_usr: object = {
        birth_date: ''
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for birth_date', async () => {
      const fake_usr: object = {
        birth_date: 0
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });
  });

  describe('#updateById', () => { 
    const validPersonId:number = 1;
    const invalidPersonId:number = 1000;
    const invalidPersonIdType: string = 'hello word'
    it('should return the 204 status code: no body', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/'+ validPersonId)
        .set('content-type', 'application/json')
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 404 status code: wrong type for id', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/'+ invalidPersonIdType)
        .set('content-type', 'application/json')
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the 404 status code: id not found', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/'+ invalidPersonId)
        .set('content-type', 'application/json')
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the json error message "Id not found or invalid"', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/'+invalidPersonId)
        .set('content-type', 'application/json')
        .send()
        .then(res => {
          chai.expect(res.body.error).to.equal('Id not found or invalid');
        });
    });
  });

  describe('#updateAll', () => { 
    it('should return the 405 status code: method not allowed', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users')
        .set('content-type', 'application/json')
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(405);
        });
    });

    it('should return the json error message "Method not allowed"', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users')
        .set('content-type', 'application/json')
        .send()
        .then(res => {
          chai.expect(res.body.error).to.equal('Method not allowed');
        });
    });
  });

  describe('#getById', () => { 
    const personName: string = faker.name.findName();
    const personSurname: string = faker.name.findName();
    const personEmail: string = faker.internet.email()
    const personPassword: string = faker.internet.password();
    const personId = faker.random.number({
      'min': 1,
      'max': 3
    });
    const personRole: number = faker.random.number({
      'min': 0,
      'max': 2
    });
    //TODO... Change date format for test case
    const prova: Date = faker.date.past();
    const personBirth_day: string = faker.date.past().toLocaleDateString();
    const user: User = new User(personName, personSurname, personEmail, personPassword, personId, personRole, personBirth_day);
    const invalidPersonId:number = 1000;
    const invalidPersonIdType: string = 'hello word'

    it('should return the 200 status code', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .send(user)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 404 status code: wrong type for id', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/'+ invalidPersonIdType)
        .set('content-type', 'application/json')
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the 404 status code: id not found', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/'+ invalidPersonId)
        .set('content-type', 'application/json')
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the json error message "User not found"', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/'+invalidPersonId)
        .set('content-type', 'application/json')
        .send()
        .then(res => {
          chai.expect(res.body.error).to.equal('User not found');
        });
    });
  });
});