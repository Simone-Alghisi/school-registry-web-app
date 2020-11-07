/**
 * It verifies if a newly created instance of {@link User}
 * contains all the properties specified in its definition
 * @packageDocumentation
 */

import 'mocha';
import chai from 'chai';
import { User } from '../../lib/models/user.model'
import * as faker from 'faker';

describe('User', () => {
  const personName: string = faker.name.findName();
  const personSurname: string = faker.name.findName();
  const personEmail: string = faker.internet.email()
  const personPassword: string = faker.internet.password();
  const personId: number = faker.random.number();
  const personRole: number = faker.random.number();
  const personBirth_day: string = faker.name.findName();
  const user: User = new User(personName, personSurname, personEmail, personPassword, personId, personRole, personBirth_day);
  
  describe('#constructor', () => {
    it('should have name', () =>{
        return chai.expect(user).to.have.property('name');
    });
    it('should have surname', () =>{
        return chai.expect(user).to.have.property('surname');
    });
    it('should have email', () =>{
        return chai.expect(user).to.have.property('email');
    });
    it('should have password', () =>{
        return chai.expect(user).to.have.property('password');
    });
    it('should have id', () =>{
        return chai.expect(user).to.have.property('id');
    });
    it('should have role', () =>{
        return chai.expect(user).to.have.property('role');
    });
    it('should have birth_date', () =>{
        return chai.expect(user).to.have.property('birth_date');
    });
  });
});