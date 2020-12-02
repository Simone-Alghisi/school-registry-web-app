import 'mocha';
import chai from 'chai';
import app from '../../lib/app';
import { GradeRoutes } from '../../lib/routes/grade.route';

describe('GradeRoutes', () => {
  const gradeRoutes: GradeRoutes = new GradeRoutes(app);
  
  describe('#constructor', () => {
    it('should have app', () => {
      return chai.expect(gradeRoutes).to.have.property('app');
    });
    it('should have a name', () => {
      return chai.expect(gradeRoutes).to.have.property('name');
    });
    it('should have the configureRoutes functions', () => {
      return chai.expect(gradeRoutes).to.have.property('configureRoutes');
    });
  });

  describe('#getName', () => {
    it('the name should not be null', () => {
      return chai.expect(gradeRoutes.getName()).not.be.null;
    });
    it('should return a string', () => {
      return chai.expect(gradeRoutes.getName()).to.be.a('string');
    });
    it('should return the route name', () => {
      return chai.expect(gradeRoutes.getName()).to.equal('GradeRoutes');
    });
  });
});