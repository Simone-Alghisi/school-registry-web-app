/**
 * Tests the validator functions for the class schema 
 * @packageDocumentation
 */

import 'mocha';
import chai from 'chai';
import { ClassMiddleware } from '../../lib/middlewares/class.middleware'
import * as faker from 'faker';

describe('ClassModel', () => {
  describe('#validate', () => {
    it('should be invalid if name is empty', function() {
      chai.expect(ClassMiddleware.validField('', 'name')).be.false;
    });
    
    it('should be invalid if name is a number', function() {
      chai.expect(ClassMiddleware.validField(faker.random.number(), 'name')).be.false;
    });
  
    it('should be valid if name is a string', function() {
      chai.expect(ClassMiddleware.validField(faker.lorem.text(), 'name')).be.true;
    });  
  });
});