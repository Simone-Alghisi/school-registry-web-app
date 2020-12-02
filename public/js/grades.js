import { getUrlVars } from './common.js';
import { prepareClassOnLoad, setClassName } from './commonProfessor.js';

(function ($){
  "use strict";

  let grades_list = [];
  let studentsRetrieved = [];
  let students = [];
  let table = $('#studentsTable').DataTable();
  let gradeTable = $('#gradesTable').DataTable({
    'paging': false,
    'searching': false,
    'info': false
  });
  const vars = getUrlVars();
  let class_id = vars['class']
  let subject = vars['subject'];

  function retrieveStudents(attemptMade = false){
    const url = '../api/v1/users?role=0&class_id=' + class_id;
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
            refreshToken().then(() => retrieveStudents(true)).catch(() => dealWithForbiddenErrorCode());
          }else{
            dealWithForbiddenErrorCode();
          }
        } else {
          dealWithServerErrorCodes();
        }
      })
      .then((data) => {
        if(data){
          studentsRetrieved = data;
        } 
      });
  }

  function retrieveGrades(attemptMade = false){
    const url = '../api/v1/classes/' + class_id + '/grades?subject=' + subject;
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
        } else {
          dealWithServerErrorCodes();
        }
      })
      .then((data) => {
        if(data){
          grades_list = data;
          return;
        } 
      });
  }

  function reassingStudent(student){
    if(!students[student._id]){
      students[student._id] = {name: student.name, surname: student.surname, total: 0, grades: []};
    }
  }

  function assignGradesToStudents(){
    grades_list.forEach((grade) => {
      if(students[grade.student_id]){
        students[grade.student_id].grades.push(grade);
        students[grade.student_id].total += grade.value;
      }
    })
  }

  function addRow(key){
    let student = students[key];
    let n_grades = student.grades.length;
    table.row.add([
      student.surname + " " + student.name,
      n_grades,
      n_grades > 0 ? student.total / n_grades : total
    ]).draw().node().id = key;
  }

  function setGrades(){
    retrieveStudents()
    .then(() => {
      for(const student in studentsRetrieved){
        reassingStudent(studentsRetrieved[student])
      }
    })
    .then(async () => {
      await retrieveGrades();
    }).then(() => {
      assignGradesToStudents();
      for(const key in students){
        addRow(key);
      }
      setEventShowStudentGrades();
    })
  }

  function setEventShowStudentGrades(){
    $('#studentsTable tbody').on('click', 'tr', function () {
      gradeTable.clear();
      let student_id = table.row(this).node().id;
      let student = students[student_id];
      $('#gradesModalLable').text('Storico Voti di ' + student.surname + ' ' + student.name);
      let grade;
      for(const key in student.grades){
        grade = student.grades[key];
        gradeTable.row.add([
          '<button type="button" class="btn btn-danger removeGrade">Rimuovi</button>',
          grade.description,
          grade.date,
          grade.value
        ]).draw().node().id = grade._id;
      }
      $("#gradesModal").modal("show");
      //TODO... implement delete single grade here
    });
  }

  $('#addGrades').attr("onclick", "location.href='./insertGrades.html?class=" + class_id + "&subject=" + subject + "';");
  $('#navViewGrades').attr("href", "./grades.html?class=" + class_id + "&subject=" + subject);
  
  prepareClassOnLoad();
  setClassName();
  setGrades();
}) (jQuery);