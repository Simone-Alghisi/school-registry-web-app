/**
 * The test verifies if a newly created instance of {@link CommonRoutes}
 * has the properties _app_ and _name_. It also verifies if the property
 * _name_ is not null, if the type is string and if it contains the same
 * value passed to the constructor
 * @packageDocumentation
 */

import 'mocha';
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