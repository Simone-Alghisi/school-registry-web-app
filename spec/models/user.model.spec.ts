/**
 * Tests the validator functions for the schema user
 * @packageDocumentation
 */

import 'mocha';
import chai from 'chai';
import { UserMiddleware } from '../../lib/middlewares/user.middleware'
import * as faker from 'faker';
import moment from 'moment';

describe('UserModel', () => {
  describe('#validate', () => {
    it('should be invalid if name is empty', function() {
      chai.expect(UserMiddleware.validField('', 'name')).be.false;
    });
    
    it('should be invalid if name is a number', function() {
      chai.expect(UserMiddleware.validField(faker.random.number(), 'name')).be.false;
    });
  
    it('should be valid if name is a string', function() {
      chai.expect(UserMiddleware.validField(faker.name.firstName(), 'name')).be.true;
    });
  
    it('should be invalid if surname is empty', function() {
      chai.expect(UserMiddleware.validField('', 'surname')).be.false;
    });
    
    it('should be invalid if surname is a number', function() {
      chai.expect(UserMiddleware.validField(faker.random.number(), 'surname')).be.false;
    });
  
    it('should be valid if surname is a string', function() {
      chai.expect(UserMiddleware.validField(faker.name.lastName(), 'surname')).be.true;
    });
  
    it('should be invalid if email is empty', function() {
      chai.expect(UserMiddleware.validField('', 'email')).be.false;
    });
    
    it('should be invalid if email is a number', function() {
      chai.expect(UserMiddleware.validField(faker.random.number(), 'email')).be.false;
    });
  
    it('should be valid if email is a string', function() {
      chai.expect(UserMiddleware.validField(faker.internet.email(), 'email')).be.true;
    });
    
    it('should be invalid if password is empty', function() {
      chai.expect(UserMiddleware.validField('', 'password')).be.false;
    });
    
    it('should be invalid if password is a number', function() {
      chai.expect(UserMiddleware.validField(faker.random.number(), 'password')).be.false;
    });
  
    it('should be valid if password is a string', function() {
      chai.expect(UserMiddleware.validField(faker.lorem.text(), 'password')).be.true;
    });
  
    it('should be invalid if salt is empty', function() {
      chai.expect(UserMiddleware.validField('', 'salt')).be.false;
    });
    
    it('should be invalid if salt is a number', function() {
      chai.expect(UserMiddleware.validField(faker.random.number(), 'salt')).be.false;
    });
    
    it('should be valid if salt is a string', function() {
      chai.expect(UserMiddleware.validField(faker.lorem.text(), 'salt')).be.true;
    });
  
    it('should be invalid if role is empty', function() {
      chai.expect(UserMiddleware.validField('', 'role')).be.false;
    });
    
    it('should be invalid if role is a string', function() {
      chai.expect(UserMiddleware.validField(faker.lorem.text(), 'role')).be.false;
    });
  
    it('should be invalid if role is above 2', function() {
      chai.expect(UserMiddleware.validField(3, 'role')).be.false;
    });
  
    it('should be invalid if role is below 0', function() {
      chai.expect(UserMiddleware.validField(-1, 'role')).be.false;
    });
  
    it('should be valid if role is between 0 and 2 included', function() {
      chai.expect(UserMiddleware.validField(1, 'role')).be.true;
    });
  
    it('should be invalid if bith_date is a empty', function() {
      chai.expect(UserMiddleware.validField('', 'birth_date')).be.false;
    });
  
    it('should be invalid if birth_date is number', function() {
      chai.expect(UserMiddleware.validField(faker.random.number(), 'birth_date')).be.false;
    });
  
    it('should be invalid if birth_date is in an invalid format', function() {
      const dateFormat = 'DD-MM-YYYY';
      chai.expect(UserMiddleware.validField(moment(faker.date.past()).format(dateFormat), 'birth_date')).be.false;    
    });
    
    it('should be valid if birth_date is an valid string', function() {
      const dateFormat = 'YYYY-MM-DD';
      chai.expect(UserMiddleware.validField(moment(faker.date.past()).format(dateFormat), 'birth_date')).be.true;    
    });
  });
});