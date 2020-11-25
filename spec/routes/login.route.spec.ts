import 'mocha';
import chai from 'chai';
import app from '../../lib/app';
import { LoginRoutes } from '../../lib/routes/login.route'
import * as faker from 'faker';

describe('UserRoutes', () => {
  const routeName: string = faker.name.findName();
  const loginRoutes: LoginRoutes = new LoginRoutes(app);
  
  describe('#constructor', () => {
    it('should have app', () => {
      return chai.expect(loginRoutes).to.have.property('app');
    });
    it('should have a name', () => {
      return chai.expect(loginRoutes).to.have.property('name');
    });
    it('should have the configureRoutes functions', () => {
      return chai.expect(loginRoutes).to.have.property('configureRoutes');
    });
  });

  describe('#getName', () => {
    it('the name should not be null', () => {
      return chai.expect(loginRoutes.getName()).not.be.null;
    });
    it('should return a string', () => {
      return chai.expect(loginRoutes.getName()).to.be.a('string');
    });
    it('should return the route name', () => {
      return chai.expect(loginRoutes.getName()).to.equal(routeName);
    });
  });
});