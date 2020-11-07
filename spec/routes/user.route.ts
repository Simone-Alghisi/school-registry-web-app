import 'mocha';
import chai from 'chai';
import app from '../../lib/app';
import { UserRoutes } from '../../lib/routes/user.route'
import * as faker from 'faker';

describe('UserRoutes', () => {
  const routeName: string = faker.name.findName();
  const userRoutes: UserRoutes = new UserRoutes(app);
  
  describe('#constructor', () => {
    it('should have app', () => {
      return chai.expect(userRoutes).to.have.property('app');
    });
    it('should have a name', () => {
      return chai.expect(userRoutes).to.have.property('name');
    });
    it('should have the configureRoutes functions', () => {
      return chai.expect(userRoutes).to.have.property('configureRoutes');
    });
  });

  describe('#getName', () => {
    it('the name should not be null', () => {
      return chai.expect(userRoutes.getName()).not.be.null;
    });
    it('should return a string', () => {
      return chai.expect(userRoutes.getName()).to.be.a('string');
    });
    it('should return the route name', () => {
      return chai.expect(userRoutes.getName()).to.equal(routeName);
    });
  });
});