import 'mocha';
import chai from 'chai';
import app from '../../lib/app';
import { CommunicationRoutes } from '../../lib/routes/communication.route';

describe('CommunicationRoutes', () => {
  const communicationRoutes: CommunicationRoutes = new CommunicationRoutes(app);
  
  describe('#constructor', () => {
    it('should have app', () => {
      return chai.expect(communicationRoutes).to.have.property('app');
    });
    it('should have a name', () => {
      return chai.expect(communicationRoutes).to.have.property('name');
    });
    it('should have the configureRoutes functions', () => {
      return chai.expect(communicationRoutes).to.have.property('configureRoutes');
    });
  });

  describe('#getName', () => {
    it('the name should not be null', () => {
      return chai.expect(communicationRoutes.getName()).not.be.null;
    });
    it('should return a string', () => {
      return chai.expect(communicationRoutes.getName()).to.be.a('string');
    });
    it('should return the route name', () => {
      return chai.expect(communicationRoutes.getName()).to.equal('CommunicationRoutes');
    });
  });
});