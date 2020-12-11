export { students, student_id, class_id, subject, gradesToRemove };

import { getUrlVars, refreshToken, dealWithForbiddenErrorCode } from './common.js';
import { prepareClassOnLoad, setClassName, gradesMapping } from './commonProfessor.js';

let students = [];
let gradesToRemove = [];
let student_id;
const vars = getUrlVars();
let class_id = vars['class'];
let subject = vars['subject'];

(function ($){
  "use strict";

  let grades_list = [];
  let studentsRetrieved = [];
  let table = $('#studentsTable').DataTable();
  let gradeTable = $('#gradesTable');

  function retrieveStudents(attemptMade){
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
            refreshToken().then(() => setGrades(true)).catch(() => dealWithForbiddenErrorCode());
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

  function retrieveGrades(attemptMade){
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
            refreshToken().then(() => setGrades(true)).catch(() => dealWithForbiddenErrorCode());
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
      if(students[grade.student_id] && !students[grade.student_id].grades[grade._id]){
        students[grade.student_id].grades[grade._id] = grade;
        students[grade.student_id].total += grade.value;
        students[grade.student_id].grades.length++;
      }
    })
  }

  function addRow(key){
    let student = students[key];
    let n_grades = student.grades.length;
    table.row.add([
      student.surname + " " + student.name,
      n_grades,
      n_grades > 0 ? student.total / n_grades : student.total
    ]).draw().node().id = key;
  }

  function setGrades(attemptMade = false){
    students = [];
    gradesToRemove = [];
    grades_list = [];
    studentsRetrieved = [];
    retrieveStudents(attemptMade)
    .then(() => {
      for(const student in studentsRetrieved){
        reassingStudent(studentsRetrieved[student])
      }
    })
    .then(async () => {
      await retrieveGrades(attemptMade);
    }).then(() => {
      assignGradesToStudents();
      table.clear();
      for(const key in students){
        addRow(key);
      }
      setEventShowStudentGrades();
    })
  }

  function setEventShowStudentGrades(){
    $('#studentsTable tbody').on('click', 'tr', function () {
      gradeTable.empty();
      student_id = table.row(this).node().id;
      let student = students[student_id];
      $('#gradesModalLable').text('Storico Voti di ' + student.surname + ' ' + student.name);
      let grade;
      for(const key in student.grades){
        grade = student.grades[key];
        let grades_list = '<select id="value" class="form-control">';
        for (let key in gradesMapping) {
          if(key != 0)
            grades_list += '<option value="' + key + '" ' + (grade.value == key ? 'selected' : '') + '>' + gradesMapping[key] + '</option>';
        }
        grades_list += '</select>';
        gradeTable.append('<tr id="' + grade._id + '"><td>' +
          '<button type="button" class="btn btn-danger removeGrade">Rimuovi</button></td>' +
          '<td><input type="text" id="description" class="form-control"  value="' + grade.description + '"/></td>' + 
          '<td><input type="date" id="date" class="form-control"  value="' + grade.date + '"/></td>' +
          '<td>' + grades_list + '</td></tr>'
        )
      }
      $("#gradesModal").modal("show");
    });
  }

  $('#gradesModal').on('click', 'button.removeGrade', function(e) {
    let toRemove = $(this).closest('tr');
    let idToRemove = toRemove[0].id;
    $('#'+idToRemove).prop('hidden', true);
    gradesToRemove.push(idToRemove);
  });

  $('#gradesModal').on('hidden.bs.modal', function(e){
    gradesToRemove = [];
  });
  

  $('#addGrades').attr("onclick", "location.href='./insertGrades.html?class=" + class_id + "&subject=" + subject + "';");
  $('#navViewGrades').attr("href", "./grades.html?class=" + class_id + "&subject=" + subject);
  
  prepareClassOnLoad();
  setClassName();
  setGrades();
}) (jQuery);