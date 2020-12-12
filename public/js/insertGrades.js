import {
  getUrlVars,
  refreshToken,
  dealWithForbiddenErrorCode,
  dealWithServerErrorCodes
} from './common.js';

import {
  prepareClassOnLoad,
  setClassName,
  gradesMapping
} from './commonProfessor.js';

(function ($) {
  "use strict";

  let class_id = getUrlVars()['class'];
  let subject = getUrlVars()['subject'];
  let usersWithGrades = [];
  let grades_list = '';
  $('#navViewGrades').attr("href", './grades.html?class=' + class_id + '&subject=' + subject);
  $('#back').attr("onclick", "location.href='./grades.html?class=" + class_id + "&subject=" + subject + "';");
  const error = "failed once, stop and re-try with refresh token"

  //datatables
  let studentsTable = $('#studentsTable').DataTable({
    'paging': false,
    'searching': false,
    'info': false
  });

  let blackList = [];

  for (let key in gradesMapping) {
    grades_list += '<option value="' + key + '">' + gradesMapping[key] + '</option>';
  }

  function getStudents(attemptMade = false){
    let url = '../api/v1/users?class_id='+ class_id +'&role=' + 0;
    fetch(url, {
      method: 'GET',
      headers: { 
        'Authorization': 'Bearer ' +  window.sessionStorage.accessToken
      }
    })
    .then((resp) => {
      if(resp.ok){
        return resp.json();
      }else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => getStudents(true)).catch(() => dealWithForbiddenErrorCode());
        }else{
          dealWithForbiddenErrorCode();
        }
      } else {
        dealWithServerErrorCodes();
      }
    })
    .then((students) => {
      if(students){
        students.forEach((user) => {
          addStudent(user);
        })
      }
    })
  }

  function addStudent(user) {
    usersWithGrades[user._id] = user;
    studentsTable.row.add([
      user.name,
      user.surname,
      '<select class="form-control" id="' + user._id + '" name="'+  user._id+'">' + grades_list + '</select>'
    ]).draw().node();
  }

  function fetchGrade(gradeElement, attemptMade) {
    return new Promise((resolve, reject) => {
      const url = '../api/v1/classes/' + class_id + '/grades';

      let data;
      data = JSON.stringify(gradeElement);

      let fetchData = {
        method: 'POST',
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
              refreshToken().then(() => sendGrades(true)).catch(() => dealWithForbiddenErrorCode());
            }else{
              dealWithForbiddenErrorCode();
            }
          } else {
            dealWithServerErrorCodes();
          }
          throw error;
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
    });
  }

  async function sendGrades(attemptMade = false) {
    let description =  $('#description').val();
    let date =  $('#date').val();
    let studentGrade = {};

    for (let key in usersWithGrades) {
      let studentId = usersWithGrades[key]._id;
      let value = $('#' + studentId + ' option:selected').val();
      studentGrade['description'] = description;
      studentGrade['subject'] = subject; 
      studentGrade['date'] = date;
      studentGrade['student_id'] = studentId;
      studentGrade['value'] = value;
      if(value != 0 && !blackList[usersWithGrades[key]._id]){
        await fetchGrade(studentGrade, attemptMade)
        .then(() => {
          blackList[usersWithGrades[key]._id] = true;
        })
        .catch((error) => {
          throw error;
        })
      }
    }
    blackList = [];
    $(location).prop('href', './grades.html?class=' + class_id + '&subject=' + subject);
  }

  $('#form').submit((event) => {
    sendGrades().catch((error) => {});
    event.preventDefault();
  });

  getStudents();
  setClassName();
  prepareClassOnLoad();

})(jQuery);