import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../lib/app';
import * as faker from 'faker';
import { ClassModel } from '../../lib/models/class.model'
import { ClassController } from '../../lib/controllers/class.controller';
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

describe('ClassController', () => {
  const userService: UserService = UserService.getInstance();
  const classController = new ClassController();

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

    console.log('token0: ' + token0);
    console.log('token1: ' + token1);
    console.log('token2: ' + token2);
  });

  after(async () => {
    await userService.deleteById(idUser0);
    await userService.deleteById(idUser1);
    await userService.deleteById(idUser2);
  });


  describe('CRUD interface implementation', () => {
    it('should implement the list function', () => {
      return chai.expect(classController).to.have.property('list');
    });
    it('should implement the create function', () => {
      return chai.expect(classController).to.have.property('create');
    });
    it('should implement the updateAll function', () => {
      return chai.expect(classController).to.have.property('updateAll')
    });
    it('should implement the deleteAll unction', () => {
      return chai.expect(classController).to.have.property('deleteAll');
    });
    it('should implement the updateById function', () => {
      return chai.expect(classController).to.have.property('updateById');
    });
    it('should implement the getById function', () => {
      return chai.expect(classController).to.have.property('getById');
    });
    it('should implement the deleteById function', () => {
      return chai.expect(classController).to.have.property('deleteById');
    });
  });

  describe('#list', () => {
    it('should return the 403 Forbidden code: student should\'t be able to request classes', async () => {
      return chai
        .request(app)
        .get('/api/v1/classes')
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: professor should\'t be able to request classes', async () => {
      return chai
        .request(app)
        .get('/api/v1/classes')
        .set('authorization', 'Bearer ' + token1)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 200 OK code', async () => {
      return chai
        .request(app)
        .get('/api/v1/classes')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });
    
    it('should return all the clssses', async () => {
      const nClasses: any = await getNumberOfClasses();
      return chai
        .request(app)
        .get('/api/v1/classes')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.body).to.have.lengthOf(nClasses);
        });
    });
  });

  describe('#create', () => {
    const className: string = faker.name.firstName(); 
    const classObj = {
      name: className
    }
    const newClass = JSON.stringify(classObj);
    
    it('should return the 403 Forbidden code: student should\'t be able to add classes', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes')
        .set('authorization', 'Bearer ' + token0)
        .set('content-type', 'application/json')
        .send(newClass)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: professor should\'t be able to add classes', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes')
        .set('authorization', 'Bearer ' + token1)
        .set('content-type', 'application/json')
        .send(newClass)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 201 status code', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(newClass)
        .then(res => {
          chai.expect(res.status).to.eql(201);
        });
    });

    it('should return the 422 status code: no body', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: empty name field', async () => {
      const fake_class: Record<string, unknown> = {
        name: '',
      };
      return chai
        .request(app)
        .post('/api/v1/classes')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_class)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 status code: wrong type for name', async () => {
      const fake_class: Record<string, unknown> = {
        name: 0,
      };
      return chai
        .request(app)
        .post('/api/v1/classes')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_class)
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('the location in the header shoud have the form api/v1/classes/id', async () => {
      return chai
        .request(app)
        .post('/api/v1/classes')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(newClass)
        .then(res => {
          chai.expect(res.header.location).to.contains('api/v1/classes/');
        });
    });
  });

  describe('#getById', () => {
    let classId: any;
    const invalidClassId = 1000;
    const invalidClassIdType = 'hello word';

    it('should return the 200 status code: student', async () => {
      const classElem: any = await getRandomClass();
      classId = classElem._id;
      return chai
        .request(app)
        .get('/api/v1/classes/'+ classId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 200 status code: professor', async () => {
      const classElem: any = await getRandomClass();
      classId = classElem._id;
      return chai
        .request(app)
        .get('/api/v1/classes/'+ classId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token1)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });


    it('should return the 200 status code: secretary', async () => {
      const classElem: any = await getRandomClass();
      classId = classElem._id;
      return chai
        .request(app)
        .get('/api/v1/classes/'+ classId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });


    it('should return the 404 status code: wrong type for id', async () => {
      return chai
        .request(app)
        .get('/api/v1/classes/'+ invalidClassIdType)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the 404 status code: id not found', async () => {
      return chai
        .request(app)
        .get('/api/v1/classes/'+ invalidClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the json error message "Class not found"', async () => {
      return chai
        .request(app)
        .get('/api/v1/classes/' + invalidClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.body.error).to.equal('Class not found');
        });
    });
  });
  
  /*describe('#deleteById', () => {

  });*/

  /*describe('#deleteAll', () => {

  }); */

  describe('#updateAll', () => {
    it('should return the 403 Forbidden code: student should\'t be able to update all classes', async () => {
      return chai
        .request(app)
        .patch('/api/v1/classes/')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token0)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: professor should\'t be able to update all classes', async () => {
      return chai
        .request(app)
        .patch('/api/v1/classes/')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token1)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 405 status code: method not allowed', async () => {
      return chai
        .request(app)
        .patch('/api/v1/classes/')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(405);
        });
    });

    it('should return the json error message "Method not allowed"', async () => {
      return chai
        .request(app)
        .patch('/api/v1/classes/')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.body.error).to.equal('Method not allowed');
        });
    });

  });

  describe('#updateById', () => {
    let validClassId: any;
    const invalidClassId = 1000;
    const invalidClassIdType = 'hello word'
    const className: string = faker.name.findName(); 
    const classObj = {
      name: className
    }
    const newClass = JSON.stringify(classObj);

    it('should return the 204 status code: no body', async () => {
      const person: any = await getRandomClass();
      validClassId = person._id;
      return chai
        .request(app)
        .patch('/api/v1/classes/'+ validClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 404 status code: wrong type for id', async () => {
      return chai
        .request(app)
        .patch('/api/v1/classes/'+ invalidClassIdType)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the 404 status code: id not found', async () => {
      return chai
        .request(app)
        .patch('/api/v1/classes/'+ invalidClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the json error message "User not found"', async () => {
      return chai
        .request(app)
        .patch('/api/v1/classes/'+invalidClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.body.error).to.equal('Class not found');
        });
    });

    it('should return the 403 Forbidden code: student should\'t be able to update user', async () => {
      return chai
        .request(app)
        .patch('/api/v1/classes/'+ validClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token0)
        .send(newClass)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: professor should\'t be able to update user', async () => {
      return chai
        .request(app)
        .patch('/api/v1/classes/'+ validClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token1)
        .send(newClass)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 200 status code', async () => {
      const newClass:any = await getRandomClass();
      validClassId = newClass._id;
      return chai
        .request(app)
        .patch('/api/v1/classes/'+ validClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(newClass)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 204 status code: no body', async () => {
      return chai
        .request(app)
        .patch('/api/v1/classes/'+ validClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send()
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: no field to edit', async () => {
      const fake_class: Record<string, unknown> = {
        name_: className
      };
      return chai
        .request(app)
        .patch('/api/v1/classes/'+ validClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_class)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: empty name field', async () => {
      const fake_class: Record<string, unknown> = {
        name_: ''
      };
      return chai
        .request(app)
        .patch('/api/v1/classes/'+ validClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_class)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

    it('should return the 204 status code: wrong type for name', async () => {
      const fake_class: Record<string, unknown> = {
        name: 0,
      };
      return chai
        .request(app)
        .patch('/api/v1/classes/'+ validClassId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(fake_class)
        .then(res => {
          chai.expect(res.status).to.eql(204);
        });
    });

  });
});