/**
 * It verifies if a request to _/_ succeeds with status 200 OK
 * and returns _'Hello World'_
 * @packageDocumentation
 */

import 'mocha';
import fs from 'fs';
import app from '../lib/app';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

describe('CORS enabled ', () => {
  it('should have the Access-Control-Allow-Origin header', async () => {
    return chai
      .request(app)
      .options('/')
      .then(res => {
        chai.expect(res).to.have.header('access-control-allow-origin');
      });
  });

  it('should have the Access-Control-Allow-Origin value set to *', async () => {
    return chai
      .request(app)
      .options('/')
      .then(res => {
        chai.expect(res).to.have.header('access-control-allow-origin', '*');
      });
  });
});

describe('OPTIONS HTTP verb', () => {
  it('should return 200 code', async () => {
    return chai
      .request(app)
      .options('/')
      .then(res => {
        chai.expect(res.status).to.eql(200);
      });
  });

  it('should contain the Access-Control-Allow-Methods header', async () => {
    return chai
      .request(app)
      .get('/aaaaaaaa')
      .then(res => {
        chai.expect(res).to.have.header('access-control-allow-headers');
      });
  });
});

describe('Default 404 handler', () => {
  const nonExistingPage = 'IdoNotExist.html';
  const nonExistingResource = 'IamNotAResource';

  it('should return 404 code: Non existing html page', async () => {
    return chai
      .request(app)
      .get('/' + nonExistingPage)
      .then(res => {
        chai.expect(res.status)
      });
  });

  it('should return "Not found" error: Non existing html page', async () => {
    return chai
      .request(app)
      .get('/' + nonExistingPage)
      .then(res => {
        chai.expect(res.body.error).to.eql('Not found');
      });
  });

  it('should return 404 code: Non existing resource in api v1', async () => {
    return chai
      .request(app)
      .get('/api/v1/' + nonExistingResource)
      .then(res => {
        chai.expect(res.status).to.eql(404);
      });
  });

  it('should return "Not found" error: Non existing resource in api v1', async () => {
    return chai
      .request(app)
      .get('/aaaaaa')
      .then(res => {
        chai.expect(res.body.error).to.eql('Not found');
      });
  });
});

describe('Static frontend pages', () => {
  const usersPage: string = fs.readFileSync('public/users.html','utf8');
  const insertUserPage: string = fs.readFileSync('public/insertUser.html','utf8');

  it('users.html should be accessible 200 OK', async () => {
    return chai
      .request(app)
      .get('/users.html')
      .then(res => {
        chai.expect(res.status).to.eql(200);
      });
  });

  it('get request to users.html should return the users html page', async () => {
    return chai
      .request(app)
      .get('/users.html')
      .then(res => {
        chai.expect(res.text).to.eql(usersPage);
      });
  });

  it('insertUser.html should be accessible 200 OK', async () => {
    return chai
      .request(app)
      .get('/insertUser.html')
      .then(res => {
        chai.expect(res.status).to.eql(200);
      });
  });

  it('get request to insertUser.html should return the insertUser html page', async () => {
    return chai
      .request(app)
      .get('/insertUser.html')
      .then(res => {
        chai.expect(res.text).to.eql(insertUserPage);
      });
  });
});