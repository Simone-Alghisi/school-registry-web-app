import { retrieveClassStudent, subjectMapping, gradesMapping, class_id, student_id } from './commonStudent.js';

import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes } from './common.js';


(function ($){
  "use strict";
 
  let gradeTable = $('#gradesTable').DataTable();

  /**
   * Wait to retrieve class id and student id 
   * Then wait the fetch of the grades of a particolar student of the class
   */
  async function setGrades(){
    await retrieveClassStudent();
    await retrieveGrades();
  }

  /**
   * Fetch of the grades of a particolar student of the class
   * Insert the data retrieved in a data table
   * @param {*} attemptMade param used for refresh token
   */
  function retrieveGrades(attemptMade = false){
    const url = '../api/v1/classes/' + class_id + '/grades?student_id=' + student_id;
    let fetchData = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
    }
    return fetch(url, fetchData)
      .then((resp) => {
        if(resp.ok) {
          return resp.json();
        } else if(resp.status == 403){
          if(!attemptMade){
            refreshToken().then(() => retrieveGrades(true)).catch(() => dealWithForbiddenErrorCode());
          }else{
            dealWithForbiddenErrorCode();
          }
        }else if(resp.status == 404){
          return retrieveGrades();
        } else {
          dealWithServerErrorCodes();
        }
      })
      .then((data) => {
        if(data && !data.error){
          data.map((elem) =>{
            gradeTable.row.add([
              subjectMapping[elem.subject],
              elem.description,
              elem.date,
              gradesMapping[elem.value]
            ]).draw().node();
          })
        }
      });
  }

  setGrades();
}) (jQuery);