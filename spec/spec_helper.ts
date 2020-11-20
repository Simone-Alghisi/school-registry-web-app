import faker from 'faker';
import moment from 'moment';
import { RequestOptions } from 'https';
import { ClientRequest, IncomingMessage } from 'http';
import http from 'http';

const dateFormat = 'YYYY-MM-DD';

export const user_role_0 = {
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  role: 0,
  birth_date: moment(new Date()).format(dateFormat)
}

export const user_role_1 = {
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  role: 1,
  birth_date: moment(new Date()).format(dateFormat)
}

export const user_role_2 = {
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  role: 2,
  birth_date: moment(new Date()).format(dateFormat)
}

export function userAccessToken(email: string, password: string) {
  return new Promise((resolve, reject) => {
    const options : RequestOptions = {
      hostname: 'localhost',
      path: '/api/v1/login',
      port: process.env.PORT,
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }

    const request: ClientRequest = http.request(options, (res: IncomingMessage) => {
      let data = '';
      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        data += chunk;
      })

      res.on('end', () => {
        resolve((JSON.parse(data)).accessToken);
      })
    })

    request.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      reject(e);
    })
  
    request.write(JSON.stringify({
      email: email,
      password: password
    }))
  
    request.end();
  })
}