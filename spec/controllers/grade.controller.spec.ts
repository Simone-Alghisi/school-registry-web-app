import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../lib/app';
import * as faker from 'faker';
import moment from 'moment';
import { ClassModel } from '../../lib/models/class.model'
import { GradeController } from '../../lib/controllers/grade.controller';
import { user_role_0, user_role_1, user_role_2, userAccessToken, some_class, dateFormat } from '../spec_helper';
import { UserService } from '../../lib/services/user.service';
import { ClassService } from '../../lib/services/class.service';
import mongoose from 'mongoose';

chai.use(chaiHttp);

let classModel: ClassModel;
let idUser0: string;
let idUser1: string;
let idUser2: string;
let token0: string;
let token1: string;
let token2: string;
let class_id: string;
let student_id: string;
let classElem: any;


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

async function getRandomGrade(classInstance: any){
  const grades_list = classInstance.grades_list;
  console.log(grades_list)
}

async function createClass(){
  const classService: ClassService = ClassService.getInstance();
  return await classService.create(some_class);
}

async function createUserOfThatClass(class_id: string){
  const userService: UserService = UserService.getInstance();
  return await userService.create({
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    role: 0,
    birth_date: moment(new Date()).format(dateFormat),
    class_id: class_id
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
    class_id = await createClass();
    student_id = await createUserOfThatClass(class_id);

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
    it('should return the 403 error code: no token provided', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + class_id + '/grades')
        .send({
          value: faker.random.number({min:0, max:10}),  
          date: moment(faker.date.past()).format(dateFormat), 
          subject: faker.random.number({min:0, max:4}),
          description: faker.lorem.text(),
          student_id: student_id
        })
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 422 error code: class does not exists', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + (new mongoose.Types.ObjectId) + '/grades')
        .send({
          value: faker.random.number({min:0, max:10}),  
          date: moment(faker.date.past()).format(dateFormat), 
          subject: faker.random.number({min:0, max:4}),
          description: faker.lorem.text(),
          student_id: student_id
        })
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 422 error code: value below 0', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + class_id + '/grades')
        .set('authorization', 'Bearer ' + token1)
        .send({
          value: faker.random.number({min:-10, max:-1}),  
          date: moment(faker.date.past()).format(dateFormat), 
          subject: faker.random.number({min:0, max:4}),
          description: faker.lorem.text(),
          student_id: student_id
        })
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 error code: value above 10', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + class_id + '/grades')
        .set('authorization', 'Bearer ' + token1)
        .send({
          value: faker.random.number({min:11, max:100}),  
          date: moment(faker.date.past()).format(dateFormat), 
          subject: faker.random.number({min:0, max:4}),
          description: faker.lorem.text(),
          student_id: student_id
        })
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 error code: invalid type of value', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + class_id + '/grades')
        .set('authorization', 'Bearer ' + token1)
        .send({
          value: faker.lorem.text(),  
          date: moment(faker.date.past()).format(dateFormat), 
          subject: faker.random.number({min:0, max:4}),
          description: faker.lorem.text(),
          student_id: student_id
        })
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 error code: invalid type of date', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + class_id + '/grades')
        .set('authorization', 'Bearer ' + token1)
        .send({
          value: faker.random.number({min:0, max:10}),  
          date: faker.random.number(), 
          subject: faker.random.number({min:0, max:4}),
          description: faker.lorem.text(),
          student_id: student_id
        })
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 error code: invalid type of subject', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + class_id + '/grades')
        .set('authorization', 'Bearer ' + token1)
        .send({
          value: faker.random.number({min:0, max:10}),  
          date: moment(faker.date.past()).format(dateFormat), 
          subject: faker.lorem.text(),
          description: faker.lorem.text(),
          student_id: student_id
        })
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 error code: invalid type of description', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + class_id + '/grades')
        .set('authorization', 'Bearer ' + token1)
        .send({
          value: faker.random.number({min:0, max:10}),  
          date: moment(faker.date.past()).format(dateFormat), 
          subject: faker.random.number({min:0, max:4}),
          description: faker.random.number(),
          student_id: student_id
        })
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 error code: invalid student id', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + class_id + '/grades')
        .set('authorization', 'Bearer ' + token1)
        .send({
          value: faker.random.number({min:0, max:10}),  
          date: moment(faker.date.past()).format(dateFormat), 
          subject: faker.random.number({min:0, max:4}),
          description: faker.lorem.text(),
          student_id: new mongoose.Types.ObjectId
        })
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 error code: missing field', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + class_id + '/grades')
        .set('authorization', 'Bearer ' + token1)
        .send({
          value: faker.random.number({min:0, max:10}),  
          date: moment(faker.date.past()).format(dateFormat),
          description: faker.lorem.text(),
          student_id: student_id
        })
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 201 status code: grade created', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + class_id + '/grades')
        .set('authorization', 'Bearer ' + token1)
        .send({
          value: faker.random.number({min:0, max:10}),  
          date: moment(faker.date.past()).format(dateFormat), 
          subject: faker.random.number({min:0, max:4}),
          description: faker.lorem.text(),
          student_id: student_id
        })
        .then(res => {
          chai.expect(res.status).to.eql(201);
        });
    });

    it('should have the proper location header', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes/' + class_id + '/grades')
        .set('authorization', 'Bearer ' + token1)
        .send({
          value: faker.random.number({min:0, max:10}),  
          date: moment(faker.date.past()).format(dateFormat), 
          subject: faker.random.number({min:0, max:4}),
          description: faker.lorem.text(),
          student_id: student_id
        })
        .then(res => {
          chai.expect(res.header.location).to.contains('api/v1/classes/' + class_id + '/grades/');
        });
    });
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
    let classInstance: any;
    const invalidClassId = 1000;
    let validGradeId: any;
    const invalidGradeId = 1000;
    const gradeDate: string = moment(faker.date.past()).format(dateFormat);
    const gradeDescription: string = faker.lorem.text();
    const gradeValue: number = faker.random.number({min:0, max:10});
    const gradeObj = {
      date: gradeDate,
      description: gradeDescription,
      value: gradeValue
    }
    const gradeJSON = JSON.stringify(gradeObj);
    const classService: ClassService = ClassService.getInstance();

    it('should return the 204 status code: no body', async () => {
      classInstance = await classService.getById(class_id);
      getRandomGrade(classInstance);
      return chai
        .request(app)
        .patch('/api/v1/classes/'+ class_id)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });
  });
});