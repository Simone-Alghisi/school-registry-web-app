import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../lib/app';
import * as faker from 'faker';
import { ClassModel } from '../../lib/models/class.model'
import { GradeController } from '../../lib/controllers/grade.controller';
import { user_role_0, user_role_1, user_role_2, userAccessToken } from '../spec_helper';
import { UserService } from '../../lib/services/user.service';

chai.use(chaiHttp);

let classModel: ClassModel;
let idUser0: string;
let idUser1: string;
let idUser2: string;
let token0: string;
let token1: string;
let token2: string;

async function getNumberOfClasses(){
  return new Promise( (resolve, reject) => {
    classModel.classCollection
      .estimatedDocumentCount({})
      .exec(
        function (err, count) {
          if (err) {
            reject(err);
          } else {
            resolve(count);
          }
        })
  });
}

async function getRandomClass(){
  return new Promise( (resolve, reject) => {
    classModel.classCollection
      .findOne()
      .sort({created_at: -1})
      .exec(
        function (err, classElem) {
          if (err) {
            reject(err);
          } else {
            resolve(classElem);
          }
        })
  });
}

describe('GradeController', () => {
  const userService: UserService = UserService.getInstance();
  const gradeController = new GradeController();

  classModel = ClassModel.getInstance();

  before(async () => {
    user_role_0.email = faker.internet.email();
    user_role_1.email = faker.internet.email();
    user_role_2.email = faker.internet.email();

    idUser0 = await userService.create(JSON.parse(JSON.stringify(user_role_0)));
    idUser1 = await userService.create(JSON.parse(JSON.stringify(user_role_1)));
    idUser2 = await userService.create(JSON.parse(JSON.stringify(user_role_2)));

    await userAccessToken(user_role_0.email, user_role_0.password)
      .then((data: any) => {
        token0 = data;
      });
    
    await userAccessToken(user_role_1.email, user_role_1.password)
      .then((data: any) => {
        token1 = data;
      });

    await userAccessToken(user_role_2.email, user_role_2.password)
      .then((data: any) => {
        token2 = data;
      });
  });

  after(async () => {
    await userService.deleteById(idUser0);
    await userService.deleteById(idUser1);
    await userService.deleteById(idUser2);
  });


  describe('CRUD interface implementation', () => {
    it('should implement the list function', () => {
      return chai.expect(gradeController).to.have.property('list');
    });
    it('should implement the create function', () => {
      return chai.expect(gradeController).to.have.property('create');
    });
    it('should implement the updateAll function', () => {
      return chai.expect(gradeController).to.have.property('updateAll')
    });
    it('should implement the deleteAll unction', () => {
      return chai.expect(gradeController).to.have.property('deleteAll');
    });
    it('should implement the updateById function', () => {
      return chai.expect(gradeController).to.have.property('updateById');
    });
    it('should implement the getById function', () => {
      return chai.expect(gradeController).to.have.property('getById');
    });
    it('should implement the deleteById function', () => {
      return chai.expect(gradeController).to.have.property('deleteById');
    });
  });

  describe('#list', () => {
    let classElem: any;
    it('should return the 200 OK: student should be able to request grades', async () => {
      classElem = await getRandomClass();
      let classId = classElem._id;
      return chai
        .request(app)
        .get('/api/v1/classes/' + classId + '/grades')
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 200 OK: professor should be able to request grades', async () => {
      let classId = classElem._id;
      return chai
        .request(app)
        .get('/api/v1/classes/' + classId + '/grades')
        .set('authorization', 'Bearer ' + token1)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 200 OK: secretary should be able to request grades', async () => {
      let classId = classElem._id;
      return chai
        .request(app)
        .get('/api/v1/classes/' + classId + '/grades')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });
    
    it('should return all the grades_list of the class', async () => {
      let classId = classElem._id;
      let grades_list = classElem.grades_list;
      return chai
        .request(app)
        .get('/api/v1/classes/' + classId + '/grades')
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(JSON.stringify(res.body)).to.eql(JSON.stringify(grades_list));
        });
    });
  });

  describe('#create', () => {
    
  });

  describe('#getById', () => {
    
  });
  
  describe('#deleteById', () => {
    
  });

  describe('#deleteAll', () => {
    
  });

  describe('#updateAll', () => {

  });

  describe('#updateById', () => {

  });
});