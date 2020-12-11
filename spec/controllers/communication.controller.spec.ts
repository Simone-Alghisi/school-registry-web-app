import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../lib/app';
import * as faker from 'faker';
import moment from 'moment';
import { UserModel } from '../../lib/models/user.model';
import { CommunicationController } from '../../lib/controllers/communication.controller';
import { user_role_0, user_role_1, user_role_2, userAccessToken, dateFormat, sample_communication } from '../spec_helper';
import { UserService } from '../../lib/services/user.service';

chai.use(chaiHttp);

let userModel: UserModel;
let idUser0: string;
let idUser1: string;
let idUser2: string;
let token0: string;
let token1: string;
let token2: string;
//let userIdWithCommunications: string;
let student_id: string;
let student_email: string;
let student_password: string;
let token_student: string;


async function getAllSentCommunications(){
  return new Promise((resolve, reject) => {
    userModel.userCollection.find().select(['communications'])
      .exec(function (err, communicationsRetrievedModel) {
      if (err) {
          reject(err);
      } else {
        let communicationsToReturn:any = [];
        let communicationsRetrieved: any = deepCopy(communicationsRetrievedModel);
        if (communicationsRetrieved) {
          for(let index = 0; index < communicationsRetrieved.length; index++){
            if (communicationsRetrieved[index]['communications']) {
              let recipient = communicationsRetrieved[index]['_id'];
              communicationsRetrieved[index] = communicationsRetrieved[index]['communications'];
              let len = communicationsRetrieved[index]['length'];
              let i = 0;
              while (i < len) {
                communicationsRetrieved[index][i]['recipient'] = recipient;
                i++;
              }
              communicationsToReturn = communicationsToReturn.concat(communicationsRetrieved[index]);
            }
          }
        }
        resolve(communicationsToReturn);
      }
      })
  });
}

function deepCopy(obj:any){
  return JSON.parse(JSON.stringify(obj));
}

async function getAllReceivedCommunications(){
  let userWithCommunicationsModel,  userWithCommunications: any;
  const userService: UserService = UserService.getInstance();
  userWithCommunicationsModel = await userService.getById(student_id);
  userWithCommunications = deepCopy(userWithCommunicationsModel);
  for(let i=0; i <userWithCommunications['communications'].length; i++){
    userWithCommunications['communications'][i]['recipient'] = student_id;
  }
  return userWithCommunications['communications'];
}


async function insertCommunication() {
  const userService: UserService = UserService.getInstance();
  student_email = faker.internet.email();
  student_password = faker.internet.password();
  return await userService.create({
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    password: student_password,
    email: student_email,
    role: 0,
    birth_date: moment(new Date()).format(dateFormat),
    communications: [
      {
        sender: idUser2,
        sender_role: 2,
        subject: faker.lorem.lines(),
        content: faker.lorem.paragraph()
      },
      {
        sender: idUser2,
        sender_role: 2,
        subject: faker.lorem.lines(),
        content: faker.lorem.paragraph()
      }
    ]
  });
}

async function getValidCommunicationId() {
  const userService: UserService = UserService.getInstance();
  let validCommunicationId, validCommunication;
  let userWithCommunications = await userService.getById(student_id);
  validCommunicationId = userWithCommunications['communications'][0]['_id']; 
  validCommunication = userWithCommunications['communications'][0];
  return [validCommunicationId, validCommunication];
}

describe('CommunicationController', () => {
  const userService: UserService = UserService.getInstance();
  const communicationController = new CommunicationController();

  userModel = UserModel.getInstance();

  before(async () => {
    user_role_0.email = faker.internet.email();
    user_role_1.email = faker.internet.email();
    user_role_2.email = faker.internet.email();

    idUser0 = await userService.create(JSON.parse(JSON.stringify(user_role_0)));
    idUser1 = await userService.create(JSON.parse(JSON.stringify(user_role_1)));
    idUser2 = await userService.create(JSON.parse(JSON.stringify(user_role_2)));
    student_id = await insertCommunication();

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

    await userAccessToken(student_email, student_password)
      .then((data: any) => {
        token_student = data;
      });
  });

  after(async () => {
    await userService.deleteById(idUser0);
    await userService.deleteById(idUser1);
    await userService.deleteById(idUser2);
  });

  describe('CRUD interface implementation', () => {
    it('should implement the list function', () => {
      return chai.expect(communicationController).to.have.property('list');
    });
    it('should implement the create function', () => {
      return chai.expect(communicationController).to.have.property('create');
    });
    it('should implement the updateAll function', () => {
      return chai.expect(communicationController).to.have.property('updateAll')
    });
    it('should implement the deleteAll unction', () => {
      return chai.expect(communicationController).to.have.property('deleteAll');
    });
    it('should implement the updateById function', () => {
      return chai.expect(communicationController).to.have.property('updateById');
    });
    it('should implement the getById function', () => {
      return chai.expect(communicationController).to.have.property('getById');
    });
    it('should implement the deleteById function', () => {
      return chai.expect(communicationController).to.have.property('deleteById');
    });
  });

  describe('#list', () => {
    let communication_list: any;
    let userCommunications: any;

    before(async () => {
      communication_list = await getAllSentCommunications();
      userCommunications = await getAllReceivedCommunications();
    })

    it('should return the 403 Forbidden code: professor shouldn\'t be able to request sent communication', async () => {
      return chai
        .request(app)
        .get('/api/v1/communications')
        .set('authorization', 'Bearer ' + token1)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: student shouldn\'t be able to request sent communication', async () => {
      return chai
        .request(app)
        .get('/api/v1/communications')
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 200 OK: secretary should be able to request sent communications', async () => {
      return chai
        .request(app)
        .get('/api/v1/communications')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });
    
    it('should return all communications sent by all secretaries', async () => {
      return chai
        .request(app)
        .get('/api/v1/communications')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(JSON.stringify(res.body)).to.eql(JSON.stringify(communication_list));
        });
    });

    it('should return the 200 OK: secretary should be able to request received communications', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + idUser2 + '/communications')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 200 OK: professor should be able to request received communications', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + idUser1 + '/communications')
        .set('authorization', 'Bearer ' + token1)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 200 OK: student should be able to request received communications', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + idUser0 + '/communications')
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 403: student shouldn\'t be able to request received communications of other users', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + student_id + '/communications')
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403: professor shouldn\'t be able to request received communications of other users', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + student_id + '/communications')
        .set('authorization', 'Bearer ' + token1)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403: secretary shouldn\'t be able to request received communications of other users', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + student_id + '/communications')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    }); 

    it('should return all communications that a student has received ', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + student_id + '/communications')
        .set('authorization', 'Bearer ' + token_student)
        .then(res => {
          chai.expect(JSON.stringify(res.body)).to.eql(JSON.stringify(userCommunications));
        });
    }); 

  });

  describe('#getSentById', () => {
    let validCommunicationId: any;
    let validCommunication: any;
    let invalidCommunicationIdType: any = 'hello world'
    let invalidCommunicationId: any = '5fc75b8d8e9d0909585e3210';

    before(async () => {
      [validCommunicationId, validCommunication] = await getValidCommunicationId();
    })

    it('should return the 200 status code: secretary sent communications', async () => {
      return chai
        .request(app)
        .get('/api/v1/communications/' + validCommunicationId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 403 Forbidden code: professor shouldn\'t be able to request a single sent communication', async () => {
      return chai
        .request(app)
        .get('/api/v1/communications/' + validCommunicationId)
        .set('authorization', 'Bearer ' + token1)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: student shouldn\'t be able to request a single sent communication', async () => {
      return chai
        .request(app)
        .get('/api/v1/communications/' + validCommunicationId)
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });
    
    it('should return the 404 status code: wrong type for id', async () => {
      return chai
        .request(app)
        .get('/api/v1/communications/' + invalidCommunicationIdType)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the 404 status code: communication id not found', async () => {
      return chai
        .request(app)
        .get('/api/v1/communications/' + invalidCommunicationId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the correct communication entry', async () => {
      return chai
        .request(app)
        .get('/api/v1/communications/' + validCommunicationId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(JSON.stringify(res.body)).to.equal(JSON.stringify(validCommunication));
        });
    }); 

  });

  describe('#getById', () => {
    let validCommunicationId: any;
    let validCommunication: any;
    let invalidCommunicationIdType: any = 'hello world'
    let invalidCommunicationId: any = '5fc75b8d8e9d0909585e3210';

    before(async () => {
      [validCommunicationId, validCommunication] = await getValidCommunicationId();
    })

    it('should return the 200 status code: users can view their received communications', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + student_id + '/communications/' + validCommunicationId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token_student)
        .then(res => {
          chai.expect(res.status).to.eql(200);
        });
    });

    it('should return the 403 Forbidden code: users shouldn\'t be able to request a communication received by other users', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + student_id + '/communications/' + validCommunicationId)
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });
    
    it('should return the 404 status code: wrong type for communication id', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + student_id + '/communications/' + invalidCommunicationIdType)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token_student)
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the 404 status code: communication id not found', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + student_id + '/communications/' + invalidCommunicationId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token_student)
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the correct communication entry', async () => {
      return chai
        .request(app)
        .get('/api/v1/users/' + student_id + '/communications/' + validCommunicationId)
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token_student)
        .then(res => {
          chai.expect(JSON.stringify(res.body)).to.equal(JSON.stringify(validCommunication));
        });
    });
  });

  describe('#create', () => {
    it('should return the 403 Forbidden code: student shouldn\'t be able to send a communication', async () => {
      return chai
        .request(app)
        .post('/api/v1/users/' + student_id + '/communications')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token0)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 403 Forbidden code: professor shouldn\'t be able to send a communication', async () => {
      return chai
        .request(app)
        .post('/api/v1/users/' + student_id + '/communications')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token1)
        .then(res => {
          chai.expect(res.status).to.eql(403);
        });
    });

    it('should return the 404 not found code, the user do not exists', async () => {
      return chai
        .request(app)
        .post('/api/v1/users/' + faker.random.number() + '/communications')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .then(res => {
          chai.expect(res.status).to.eql(404);
        });
    });

    it('should return the 422 unprocessable entity code: some fields are missing', async () => {
      return chai
        .request(app)
        .post('/api/v1/users/' + student_id + '/communications')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send({content: faker.lorem.text()})
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 unprocessable entity code: wrong subject field', async () => {
      return chai
        .request(app)
        .post('/api/v1/users/' + student_id + '/communications')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send({
          subject: faker.random.number(),
          content: faker.lorem.text(),
          date: moment(new Date()).format(dateFormat)
        })
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 unprocessable entity code: wrong content field', async () => {
      return chai
        .request(app)
        .post('/api/v1/users/' + student_id + '/communications')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send({
          subject: faker.lorem.text(),
          content: faker.random.number(),
          date: moment(new Date()).format(dateFormat)
        })
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 422 unprocessable entity code: wrong date field', async () => {
      return chai
        .request(app)
        .post('/api/v1/users/' + student_id + '/communications')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send({
          subject: faker.lorem.text(),
          content: faker.lorem.text(),
          date: faker.lorem.text()
        })
        .then(res => {
          chai.expect(res.status).to.eql(422);
        });
    });

    it('should return the 201 created', async () => {
      return chai
        .request(app)
        .post('/api/v1/users/' + student_id + '/communications')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(sample_communication)
        .then(res => {
          chai.expect(res.status).to.eql(201);
        });
    });

    it('should have a valid location field: api/v1/users/', async () => {
      return chai
        .request(app)
        .post('/api/v1/users/' + student_id + '/communications')
        .set('content-type', 'application/json')
        .set('authorization', 'Bearer ' + token2)
        .send(sample_communication)
        .then(res => {
          chai.expect(res.header.location).to.contains('api/v1/users/');
        });
    });
  });
});