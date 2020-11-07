import 'mocha';
import { Application } from 'express';
import chai from 'chai';
import app from '../../../lib/app'
import { CommonRoutes } from '../../../lib/common/routes/common.routes'
import * as faker from 'faker';

describe('CommonRoutes', () => {
  const routeName: string = faker.name.findName();
  const commonRoute: CommonRoutes = new CommonRoutes(app, routeName);
  
  describe('#constructor', () => {
    it('should have app', () => {
      return chai.expect(commonRoute).to.have.property('app');
    });
    it('should have a name', () => {
      return chai.expect(commonRoute).to.have.property('name');
    });
  });

  describe('#getName', () => {
    it('the name should not be null', () => {
      return chai.expect(commonRoute.getName()).not.be.null;
    });
    it('should return a string', () => {
      return chai.expect(commonRoute.getName()).to.be.a('string');
    });
    it('should return the route name', () => {
      return chai.expect(commonRoute.getName()).to.equal(routeName);
    });
  });
});