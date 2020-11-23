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
import * as faker from 'faker';
import moment from 'moment';
import { UserModel } from '../../lib/models/user.model'
import { UserController } from '../../lib/controllers/user.controller';
import { user_role_0, user_role_1, user_role_2, userAccessToken } from '../spec_helper';
import { UserService } from '../../lib/services/user.service';

chai.use(chaiHttp);

let userModel: UserModel;
let userController: UserController;
let idUser0: string;
let idUser1: string;
let idUser2: string;
let token0: string;
let token1: string;
let token2: string;

async function getNumberOfUsers(){
  return new Promise( (resolve, reject) => {
    userModel.userCollection
      .estimatedDocumentCount({})
      .exec(
        function (err, count) {
          if (err) {
            reject(err);
          } else {
            resolve(count);
          }
        })
  });
}

async function getRandomUser(){
  return new Promise( (resolve, reject) => {
    userModel.userCollection
      .findOne()
      .sort({created_at: -1})
      .exec(
        function (err, user) {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        })
  });
}

describe('UserController', () => {
  const userService: UserService = UserService.getInstance();

  userModel = UserModel.getInstance();
  userController = new UserController();
  
  before(async () => {
    user_role_0.email = faker.internet.email();
    user_role_1.email = faker.internet.email();
    user_role_2.email = faker.internet.email();

    idUser0 = await userService.create(JSON.parse(JSON.stringify(user_role_0)));
    idUser1 = await userService.create(JSON.parse(JSON.stringify(user_role_1)));
    idUser2 = await userService.create(JSON.parse(JSON.stringify(user_role_2)));

    await userAccessToken(user_role_0.email, user_role_0.password)
      .then((data: any) => {
        token0 = data;
      });
    
    await userAccessToken(user_role_1.email, user_role_1.password)
      .then((data: any) => {
        token1 = data;
      });

    await userAccessToken(user_role_2.email, user_role_2.password)
      .then((data: any) => {
        token2 = data;
      });

    //console.log('token0: ' + token0);
    //console.log('token1: ' + token1);
    //console.log('token2: ' + token2);
  });

  after(async () => {
    await userService.deleteById(idUser0);
    await userService.deleteById(idUser1);
    await userService.deleteById(idUser2);
  });

  const dateFormat = 'YYYY-MM-DD';

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
    
    it('should return the 403 Forbidden code: student should\'t be able to request users', async () => {
      return chai
        .request(app)
        .get('/api/v1/users')
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 200 OK code', async () => {
      return chai
        .request(app)
        .get('/api/v1/users')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });
    
    it('should return all the users', async () => {
      const nUser: any = await getNumberOfUsers();
      return chai
        .request(app)
        .get('/api/v1/users')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.body).to.have.lengthOf(nUser);
        });
    });
  });

  describe('#create', () => {
    const personName: string = faker.name.firstName();
    const personSurname: string = faker.name.lastName();
    const personPassword: any = faker.internet.password();
    const personEmail: string = faker.internet.email();
    const personEmail2: string = faker.internet.email();
    const personRole: number = faker.random.number({
      'min': 0,
      'max': 2
    });
    const personBirth_date: string = moment(faker.date.past()).format(dateFormat);
    const userObj = {
      name: personName, 
      surname: personSurname,
      password: personPassword,
      email: personEmail,
      role: personRole,
      birth_date: personBirth_date
    }
    const userObj2 = {
      name: personName, 
      surname: personSurname,
      password: personPassword,
      email: personEmail2,
      role: personRole,
      birth_date: personBirth_date
    }
    const user = JSON.stringify(userObj);
    const user2 = JSON.stringify(userObj2);
    
    it('should return the 403 Forbidden code: student should\'t be able to add user', async () => {
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('authorization', 'Bearer ' + token0)
        .set('content-type', 'application/json')
        .send(user)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: professor should\'t be able to add user', async () => {
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('authorization', 'Bearer ' + token1)
        .set('content-type', 'application/json')
        .send(user)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 201 status code', async () => {
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(user)
        .then(res => {
          chai.expect(res.status).to.eql(201);
        });
    });

    it('the location in the header shoud have the form api/v1/users/id', async () => {
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(user2)
        .then(res => {
          chai.expect(res.header.location).to.contains('api/v1/users/');
        });
    });

    it('should return the 422 status code: no body', async () => {
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: missing field', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: personSurname,
        email: faker.internet.email(),
        password: personPassword,
        role: personRole
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: empty name field', async () => {
      const fake_usr: Record<string, unknown> = {
        name: '',
        surname: personSurname,
        email: faker.internet.email(),
        password: personPassword,
        role: personRole,
        birth_date: personBirth_date
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: wrong type for name', async () => {
      const fake_usr: Record<string, unknown> = {
        name: 0,
        surname: personSurname,
        email: faker.internet.email(),
        password: personPassword,
        role: personRole,
        birth_date: personBirth_date
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: empty surname field', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: '',
        email: faker.internet.email(),
        password: personPassword,
        role: personRole,
        birth_date: personBirth_date
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: wrong type for surname', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: 0,
        email: faker.internet.email(),
        password: personPassword,
        role: personRole,
        birth_date: personBirth_date
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: empty email field', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: personSurname,
        email: '',
        password: personPassword,
        role: personRole,
        birth_date: personBirth_date
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: wrong type for email', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: personSurname,
        email: 0,
        password: personPassword,
        role: personRole,
        birth_date: personBirth_date
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: empty password field', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: personSurname,
        email: faker.internet.email(),
        password: '',
        role: personRole,
        birth_date: personBirth_date
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: wrong type for password', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: personSurname,
        email: faker.internet.email(),
        password: 0,
        role: personRole,
        birth_date: personBirth_date
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: empty role field', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: personSurname,
        email: faker.internet.email(),
        password: personPassword,
        role: '',
        birth_date: personBirth_date
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: wrong type for role', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: personSurname,
        email: faker.internet.email(),
        password: personPassword,
        role: 'hello world',
        birth_date: personBirth_date
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: empty birth_date field', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: personSurname,
        email: faker.internet.email(),
        password: personPassword,
        role: personRole,
        birth_date: ''
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: wrong type for birth_date', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: personSurname,
        email: faker.internet.email(),
        password: personPassword,
        role: personRole,
        birth_date: 0
      };
      return chai
        .request(app)
        .post('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });
  });

  describe('#deleteAll', () => {
    it('should return the 403 Forbidden code: student should\'t be able to delete all users', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users')
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: professor should\'t be able to delete all users', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users')
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 405 status code: operation not allowed', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.equal(405);
        });
    });

    it('should return the json error message "Method not allowed"', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.body.error).to.equal('Method not allowed');
        });
    });
  });

  describe('#deleteById', () => {
    let existingUserId: any;
    const notAUserId = 0;

    it('should return the 403 Forbidden code: student should\'t be able to delete user', async () => {
      const randomUser:any = await getRandomUser();
      existingUserId = randomUser._id;
      return chai
        .request(app)
        .delete('/api/v1/users/'+ existingUserId)
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: student should\'t be able to delete user', async () => {
      const randomUser:any = await getRandomUser();
      existingUserId = randomUser._id;
      return chai
        .request(app)
        .delete('/api/v1/users/'+ existingUserId)
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 404 status code: User not found', async () => {
      return chai
      .request(app)
      .delete('/api/v1/users/' + notAUserId)
      .set('authorization', 'Bearer ' + token2)
      .then(res => {
        chai.expect(res.status).to.equal(404);
      });
    });
    it('should return the json error message: User not found', async () => {
      return chai
      .request(app)
      .delete('/api/v1/users/' + notAUserId)
      .set('authorization', 'Bearer ' + token2)
      .then(res => {
        chai.expect(res.body.error).to.equal('User not found');
      });
    });
    it('should return the 204 status code: valid user id', async () => {
      const randomUser:any = await getRandomUser();
      existingUserId = randomUser._id;
      return chai
        .request(app)
        .delete('/api/v1/users/' + existingUserId)
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.equal(204);
        });
    });
    it('should return the 404 status code: previously valid user id', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users/' + existingUserId)
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.equal(404);
        });
    });
    it('should return the json error message: previously valid user id', async () => {
      return chai
        .request(app)
        .delete('/api/v1/users/' + existingUserId)
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.body.error).to.equal('User not found');
        });
    });
    //the element deleted should not be accessible
    it('should return the 404 status code:    previously valid user id', () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + existingUserId)
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.equal(404);
        });
    });
  });

  describe('#findAndUpdateUserById', () => {
    const personName: string = faker.name.firstName();
    const personSurname: string = faker.name.lastName();
    const personEmail: string = faker.internet.email();
    const personPassword: string = faker.internet.password();
    let personId :any;
    const personRole: number = faker.random.number({
      'min': 0,
      'max': 2
    });
    const personBirth_date: string = moment(faker.date.past()).format(dateFormat);
    const userObj = {
      name: personName, 
      surname: personSurname,
      email: personEmail,
      password: personPassword,
      role: personRole,
      birth_date: personBirth_date
    }
    const user = JSON.stringify(userObj);
    
    it('should return the 403 Forbidden code: student should\'t be able to update user', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token0)
        .send(user)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: professor should\'t be able to update user', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token1)
        .send(user)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 200 status code', async () => {
      const person:any = await getRandomUser();
      personId = person._id;
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(user)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });
    
    it('should return the 204 status code: no body', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: no field to edit', async () => {
      const fake_usr: Record<string, unknown> = {
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
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 200 status code: some field missing but it\'s not a problem', async () => {
      const fake_usr: Record<string, unknown> = {
        name: personName,
        surname: personSurname,
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 204 status code: empty name field', async () => {
      const fake_usr: Record<string, unknown> = {
        name: ''
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for name', async () => {
      const fake_usr: Record<string, unknown> = {
        name: 0,
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: empty surname field', async () => {
      const fake_usr: Record<string, unknown> = {
        surname: ''
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for surname', async () => {
      const fake_usr: Record<string, unknown> = {
        surname: 0
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: empty email field', async () => {
      const fake_usr: Record<string, unknown> = {
        email: ''
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for email', async () => {
      const fake_usr: Record<string, unknown> = {
        email: 0
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: empty password field', async () => {
      const fake_usr: Record<string, unknown> = {
        password: '',
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for password', async () => {
      const fake_usr: Record<string, unknown> = {
        password: 0
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: empty role field', async () => {
      const fake_usr: Record<string, unknown> = {
        role: ''
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for role', async () => {
      const fake_usr: Record<string, unknown> = {
        role: 'hello world'
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });
    
    it('should return the 204 status code: empty birth_date field', async () => {
      const fake_usr: Record<string, unknown> = {
        birth_date: ''
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for birth_date', async () => {
      const fake_usr: Record<string, unknown> = {
        birth_date: 0
      };
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_usr)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });
  });

  describe('#updateById', () => { 
    let validPersonId: any;
    const invalidPersonId = 1000;
    const invalidPersonIdType = 'hello word'

    it('should return the 204 status code: no body', async () => {
      const person: any = await getRandomUser();
      validPersonId = person._id;
      return chai
        .request(app)
        .patch('/api/v1/users/'+ validPersonId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
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
        .set('authorization', 'Bearer ' + token2)
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
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the json error message "User not found"', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/'+invalidPersonId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.body.error).to.equal('User not found');
        });
    });
  });

  describe('#updateAll', () => { 

    it('should return the 403 Forbidden code: student should\'t be able to update all users', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token0)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: professor should\'t be able to update all users', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users/')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token1)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 405 status code: method not allowed', async () => {
      return chai
        .request(app)
        .patch('/api/v1/users')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
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
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.body.error).to.equal('Method not allowed');
        });
    });
  });

  describe('#getById', () => { 
    const personName: string = faker.name.firstName();
    const personSurname: string = faker.name.lastName();
    const personEmail: string = faker.internet.email()
    const personPassword: string = faker.internet.password();
    let personId: any;
    const personRole: number = faker.random.number({
      'min': 0,
      'max': 2
    });
    const personBirth_date: string = moment(faker.date.past()).format(dateFormat);
    const userObj = {
      name: personName, 
      surname: personSurname,
      email: personEmail,
      password: personPassword,
      role: personRole,
      birth_date: personBirth_date
    }
    const user = JSON.stringify(userObj);
    const invalidPersonId = 1000;
    const invalidPersonIdType = 'hello word'

    it('should return the 403 Forbidden code: student should\'t be able to get a users', async () => {
      const person: any = await getRandomUser();
      personId = person._id;
      return chai
        .request(app)
        .get('/api/v1/users/' + personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token0)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 200 status code', async () => {
      const person: any = await getRandomUser();
      personId = person._id;
      return chai
        .request(app)
        .patch('/api/v1/users/'+ personId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
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
        .set('authorization', 'Bearer ' + token2)
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
        .set('authorization', 'Bearer ' + token2)
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
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.body.error).to.equal('User not found');
        });
    });
  });
});