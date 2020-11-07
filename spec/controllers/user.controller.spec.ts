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
        .get('/users')
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the users json data in db', async () => {
      return chai
          .request(app)
          .get('/users')
          .then(res => {
            chai.expect(res.body).to.eql(users);
          });
    });

    it('should be composed of 3 elements', async () => {
      return chai
          .request(app)
          .get('/users')
          .then(res => {
            chai.expect(res.body).to.have.lengthOf(3);
          });
    });
  });
});