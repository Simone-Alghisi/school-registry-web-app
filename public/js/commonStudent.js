export { retrieveClassStudent, subjectMapping, gradesMapping, class_id, student_id};

import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes, getUrlVars } from './common.js';

let gradesMapping = {
  '0': 'Nessun voto',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10'
}

let subjectMapping = {
  0: 'Matematica',
  1: 'Storia',
  2: 'Italiano',
  3: 'Inglese',
  4: 'Informatica'
}

let class_id = 0;
let student_id = 0;

/**
 * Retrive the id of the student and his class_id 
 * @param {*} attemptMade param used for refresh token 
 */
function retrieveClassStudent(attemptMade = false){
  let fetchData = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
  }
  return fetch('../api/v1/yourself', fetchData).then((resp) => {
    if(resp.ok){
      return resp.json();
    } else if(resp.status == 403){
      if(!attemptMade){
        refreshToken().then(() => retrieveClassStudent(true)).catch(() => dealWithForbiddenErrorCode());
      }else{
        dealWithForbiddenErrorCode();
      }
    } else{
      dealWithServerErrorCodes();
    }
  }).then((data) => {
    class_id = data.class_id;
    student_id = data._id;
  });
}
