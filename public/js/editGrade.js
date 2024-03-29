import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes } from './common.js';
import { student_id, students, class_id, subject, gradesToRemove} from './grades.js';

(function ($) {
  "use strict";

  /**
   * Grade to Modify
   */
  let gradesToModify = [];

  /**
   * Update Grades
   */
  async function updateGrades(){
    let student_grades = students[student_id].grades;
    loadModifiedFields(student_grades);
    for(const key in gradesToModify){
      await fetchGrade(gradesToModify[key]);
    }
    $(location).prop('href', './grades.html?class=' + class_id + '&subject=' + subject);
  }

  /**
   * Detects the change in the table and fill the gradesToModify array
   * @param { grade of the considered student } student_grades 
   */
  function loadModifiedFields(student_grades){
    let gradeIndex = 0;
    $('#gradesTable > tr').each(function(index, tr) { 
      const description = $("#description", tr).val();
      const date = $("#date", tr).val();
      const value = $("#value option:selected", tr).val();      
      let voto = {'description': description, 'date': date, 'value': value };
      for(const key in voto){
        if(voto[key] != student_grades[$(this).attr('id')][key]){
          if(!gradesToModify[gradeIndex]){
            gradesToModify[gradeIndex] = {};
            gradesToModify[gradeIndex]['_id'] = student_grades[$(this).attr('id')]['_id'];
          }
          gradesToModify[gradeIndex][key] = voto[key];
        }
      }
      if(gradesToModify[gradeIndex]){
        gradeIndex++;
      }
    });
  }

  /**
   * Fetch grade
   * @param {grade element} gradeElement 
   * @param {attempt made} attemptMade 
   */
  function fetchGrade(gradeElement,  attemptMade = false) {
    return new Promise((resolve, reject) => {
      const url = '../api/v1/classes/' + class_id + '/grades/' + gradeElement['_id'];
      
      let gradeToSend = gradeElement;
      delete gradeToSend._id;
      let data;
      data = JSON.stringify(gradeToSend);

      let fetchData = {
        method: 'PATCH',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.sessionStorage.accessToken
        }
      }
      fetch(url, fetchData)
        .then((resp) => {
          if (resp.ok) {
            return;
          } else if (resp.status == 403) {
            if(!attemptMade){
              refreshToken().then(() => fetchGrade(gradeElement, true)).catch(() => dealWithForbiddenErrorCode());
            }else{
              dealWithForbiddenErrorCode();
            }
          } else {
            dealWithServerErrorCodes();
          }
        })
        .then((resp) => {
          resolve();
        })
        .catch(
          error => {
            console.error(error)
            reject();
          }
        ); 
    });
  }

  function deleteGrade(gradeId, attemptMade = false){
    const url = '../api/v1/classes/' + class_id + '/grades/' + gradeId;
    let fetchData = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
    }
    return fetch(url, fetchData)
      .then((resp) => {
        if(resp.ok) {
          return;
        } else if(resp.status == 403){
          if(!attemptMade){
            refreshToken().then(() => deleteGrade(gradeId, true)).catch(() => dealWithForbiddenErrorCode());
          }else{
            dealWithForbiddenErrorCode();
          }
        }else if(resp.status == 404){
          return;
        } else {
          dealWithServerErrorCodes();
        }
      }).catch(() => {
        throw 'Error';
      });
  }

  async function deleteGrades(){
    for(let i=0; i < gradesToRemove.length; i++){
      await deleteGrade(gradesToRemove[i]).catch((error) => {
        throw error;
      });
    }
  }

  $('#confirmEdit').click(() => {
    deleteGrades().then(() => updateGrades()).catch(() => deleteGrades());
  });
  
})(jQuery);