export { prepareClassOnLoad, setClassName, gradesMapping };

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

let classes = [];
let teaches = [];

function setEventSelectClass(){
  $('#collapseTwo .collapse-item').on('click', function () {
    $('#classModalLabel').html('Seleziona Materia per ' + $(this).html());
    console.log(classes);
    const classSubjects = classes[$(this).html()].subjects;
    $('#materia').html('<option value="" selected="selected">Nessuna</option>');
    $('#materia').prop('disabled', true);
    for(const subject in classSubjects){
      $('#materia').append($('<option>').val(classSubjects[subject]).text(subjectMapping[classSubjects[subject]]));
      $('#materia').prop('disabled', false);
      $('#materia').prop('name', ''+classes[$(this).html()].class_id);
    }
  });
}

function setDisablePropertyOfConfirmButton(){
  $('#materia').change(function() {
    if($('#materia option:selected').text() === 'Nessuna'){
      $('#confirm').prop('disabled', true);
    } else {
      $('#confirm').prop('disabled', false);
    }
  });
}

async function retrieveClasses(attemptMade){
  let fetchData = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
  }
  return fetch('../api/v1/yourself', fetchData).then((resp) => {
    if(resp.ok){
      return resp.json();
    } else if(resp.status == 403){
      if(!attemptMade){
        refreshToken().then(() => prepareClassOnLoad(true)).catch(() => dealWithForbiddenErrorCode());
      }else{
        dealWithForbiddenErrorCode();
      }
    } else{
      dealWithServerErrorCodes();
    }
  }).then((data) => {
    if(data){
      teaches = data.teaches;
      return;
    }
  });
}

function retrieveSubjectForClasses(teach, classes, attemptMade){
  let fetchData = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
  }
  let class_id = teach.class_id;
  return fetch('../api/v1/classes/' + class_id, fetchData)
    .then((resp) => {
      if(resp.ok) {
        return resp.json();
      } else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => prepareClassOnLoad(true)).catch(() => dealWithForbiddenErrorCode());
        }else{
          dealWithForbiddenErrorCode();
        }
      } else {
        dealWithServerErrorCodes();
      }
    })
    .then((data) => {
      if(data){
        if(!classes[data.name]){
          classes[data.name] = {class_id: class_id, subjects: [teach.subject]};
        } else {
          classes[data.name].subjects.push(teach.subject);
        }
        return;
      } 
    });
}

function addClassesToNavBar(classes){
  for(const classInstance in classes){
    $('#collapseTwo div').append('<a class="collapse-item" href="" data-toggle="modal" data-target="#classModal">'+ classInstance +'</a>')
  }
  setEventSelectClass(classes)
}

function makeClassesAvailable(attemptMade){
  classes = [];
  teaches = [];
  retrieveClasses(attemptMade).then(async () => {
    for(const teach in teaches){
      await retrieveSubjectForClasses(teaches[teach], classes, attemptMade);
    };
  })
  .then(() =>  {addClassesToNavBar(classes)})
}

function setConfirmButtonEvent(){
  $('#confirm').on('click', function(){
    const class_id = $('#materia').prop('name');
    const subject = $('#materia option:selected').val();
    $(location).prop('href', './grades.html?class=' + class_id + '&subject=' + subject);
  })
}

function prepareClassOnLoad(attemptMade = false){
  makeClassesAvailable(attemptMade);
  setDisablePropertyOfConfirmButton();
  setConfirmButtonEvent();
}

function setClassName(){
  let vars = getUrlVars();
  let class_obj = {name: ''}; 
  getClassName(vars['class'], class_obj)
  .then(() => {
    $('div h1.h3').html('Classe ' + class_obj.name + ' - ' +  subjectMapping[vars['subject']]);
  })
}

function getClassName(class_id, class_obj, attemptMade = false){
  let fetchData = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
  }
  return fetch('../api/v1/classes/' + class_id, fetchData)
    .then((resp) => {
      if(resp.ok) {
        return resp.json();
      } else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => getClassName(class_id, class_obj, true)).catch(() => dealWithForbiddenErrorCode());
        }else{
          dealWithForbiddenErrorCode();
        }
      } else {
        dealWithServerErrorCodes();
      }
    })
    .then((data) => {
      if(data){
        class_obj.name = data.name;
        return; 
      } 
    });
}

