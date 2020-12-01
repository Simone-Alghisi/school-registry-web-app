import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes } from './common.js';

(function ($){
  "use strict";

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
      const classSubjects = classes[$(this).html()].subjects;
      console.log(classes[$(this).html()].class_id);
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
      if($('select option:selected').text() === 'Nessuna'){
        $('#confirm').prop('disabled', true);
      } else {
        $('#confirm').prop('disabled', false);
      }
    });
  }
  
  async function retrieveClasses(attemptMade = false){
    let fetchData = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
    }
    return fetch('../api/v1/users', fetchData).then((resp) => {
      if(resp.ok){
        return resp.json();
      } else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => retrieveClasses(true)).catch(() => dealWithForbiddenErrorCode());
        }else{
          dealWithForbiddenErrorCode();
        }
      } else{
        dealWithServerErrorCodes();
      }
    }).then((data) => {
      if(data){
        teaches = data[0].teaches;
        return;
      }
    });
  }

  function retrieveSubjectForClasses(teach, classes, attemptMade = false){
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
            refreshToken().then(() => retrieveSubjectForClasses(teach, classes, true)).catch(() => dealWithForbiddenErrorCode());
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

  function makeClassesAvailable(classes){
    retrieveClasses().then(async () => {
      for(const teach in teaches){
        await retrieveSubjectForClasses(teaches[teach], classes);
      };
    })
    .then(() =>  {addClassesToNavBar(classes)})
  }

  function setConfirmButtonEvent(){
    $('#confirm').on('click', function(){
      const class_id = $('#materia').prop('name');
      const subject = $('#materia option:selected').val();
      $(location).prop('href', './checkGrades.html?class=' + class_id + '&subject=' + subject);
    })
  }

  makeClassesAvailable(classes);
  setDisablePropertyOfConfirmButton();
  setConfirmButtonEvent();
}) (jQuery);