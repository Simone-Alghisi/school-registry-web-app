import { getUrlVars, refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes } from './common.js';

(function ($) {
  "use strict";

  let classId = getUrlVars()['id'];
  let studentsTable = $('#studentsTable').DataTable({
    'scrollY': 250,
    'paging': false,
    'searching': false,
    'info': false
  });

  let professorsTable = $('#professorsTable').DataTable({
    'scrollY': 250,
    'paging': false,
    'searching': false,
    'info': false
  });
  
  let usersToInsertListElement = $('#userToAdd');
  let usersToInsertList = [];
  let subjectSelector = $('#materia');
  let modifiedUsers = [];

  subjectSelector.prop("disabled", true);
  
  let subjectMapping = {
    0: 'Matematica',
    1: 'Storia',
    2: 'Italiano',
    3: 'Inglese',
    4: 'Informatica'
  }
  
  for (let key in subjectMapping) {
    subjectSelector.append($('<option>').val(key).text(subjectMapping[key]));
  }
  
  function getUsersToInsert() {
    fetch('../api/v1/users', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.accessToken
        }
      })
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        } else if (resp.status == 403) {
          refreshToken().catch(() => dealWithForbiddenErrorCode());
        } else {
          //dealWithServerErrorCodes();
        }
      })
      .then((data) => {
        data.map((elem) => {
          if ((!elem.class_id && elem.role === 0) || elem.role === 1) {
            addToUsersToInsertListElement(elem);
          }
        });
      })
  }
  
  function addToUsersToInsertListElement(user){
    usersToInsertListElement.append($('<option>').val(user._id).text(user.name + " " + user.surname));
    usersToInsertList[user._id] = user;
  }

  usersToInsertListElement.on('change', function (e) {
    let selectedUserElem = $(this).find('option:selected');
    //reset subject field
    subjectSelector.find('option:selected').prop('selected', false);
    subjectSelector.find('option[value=""]').prop('selected', true);
    if (selectedUserElem.val() !== '') {
      //retreive selected user data
      let selectedUser = usersToInsertList[selectedUserElem.val()];
      if (selectedUser.role === 1) {
        subjectSelector.prop("disabled", false);
      } else {
        subjectSelector.prop("disabled", true);
      }
    } else {
      subjectSelector.prop("disabled", true);
    }
  });

  /**
   * 
   */
  function getClass(){
    fetch('../api/v1/classes/' + classId, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
    })
    .then((resp) => {
      if(resp.ok){
        return resp.json();
      }else if(resp.status == 403){
        refreshToken().catch(() => dealWithForbiddenErrorCode());
      } else {
        //dealWithServerErrorCodes();
      }
    })
    .then(function (data) {
      if(!data.error){
        $('#className').val(data.name);
        getStudents(data);
        getProfessors(data);
      }else{
        $(location).prop('href', './classes.html');
      }
    })
    .catch(
      error => console.error(error)
    );
  }

  function getStudents(data){
    fetch('../api/v1/users?class_id='+ data._id +'&role=' + 0, {
      method: 'GET',
      headers: { 
        'Authorization': 'Bearer ' +  window.sessionStorage.accessToken
      }
    })
    .then((resp) => {
      if(resp.ok){
        return resp.json();
      }else if(resp.status == 403){
        refreshToken().catch(() => dealWithForbiddenErrorCode());
      } else {
        //dealWithServerErrorCodes();
      }
    })
    .then((students) => {
      students.forEach((user) => {
        addStudent(user);
      })
    })
  }

  function getProfessors(data){
    fetch('../api/v1/users?role=' + 1, {
      method: 'GET',
      headers: { 
        'Authorization': 'Bearer ' +  window.sessionStorage.accessToken
      }
    })
    .then((resp) => {
      if(resp.ok){
        return resp.json();
      }else if(resp.status == 403){
        refreshToken().catch(() => dealWithForbiddenErrorCode());
      } else {
        //dealWithServerErrorCodes();
      }
    })
    .then((professors) => {
      let modified = professors.filter((teacher) => {
        return teacher.teaches.find((t) => {
          if(t){
            return t.class_id === data._id;
          }
        })
      })
      if(!Array.isArray(modified)){
        modified = [modified];
      }
      modified.forEach((user) => {
        addProfessor(data, user);
      })
    })
  }

  function addProfessor(data, user){
    user.teaches.forEach((t) => {
      if(t.class_id === data._id){
        modifiedUsers[user._id] = user;
        professorsTable.row.add([
          user.name,
          user.surname,
          '<label id="' + t.subject + '">' + subjectMapping[t.subject] + '</label>',
          '<button type="button" class="btn btn-danger removeProfessor">Rimuovi</button>'
        ]).draw().node().id = user._id;
      }
    })
  }

  function addProfessorWithAdd(subject, user){
    let canAdd = false;
    if (!modifiedUsers[user._id]) {
      modifiedUsers[user._id] = copyUser(user);
      canAdd = true;
    } else if (!teacherTeaches(modifiedUsers[user._id], subject, classId)) {
      canAdd = true;
    }

    if (canAdd) {
      let teach = {};
      teach.subject = subject;
      teach.class_id = classId;
      modifiedUsers[user._id].teaches.push(teach);
      professorsTable.row.add([
        user.name,
        user.surname,
        '<label id="' + subject + '">' + subjectMapping[subject] + '</label>',
        '<button type="button" class="btn btn-danger removeProfessor">Rimuovi</button>'
      ]).draw().node().id = user._id;
    }

    //remove selection
    subjectSelector.find('option:selected').prop('selected', false);
    subjectSelector.find('option[value=""]').prop('selected', true);
  }

  function addStudentWithAdd(user) {
    if (!modifiedUsers[user._id] || (modifiedUsers[user._id] && (!modifiedUsers[user._id].class_id || modifiedUsers[user._id].class_id === ''))) {
      modifiedUsers[user._id] = copyUser(user);
      //set class_id of the student
      modifiedUsers[user._id].class_id = classId;
      //add to student table
      studentsTable.row.add([
        user.name,
        user.surname,
        '<button type="button" class="btn btn-danger removeStudent">Rimuovi</button>'
      ]).draw().node().id = user._id;
    }

    //remove selection
    usersToInsertListElement.find('option:selected').prop('selected', false);
    usersToInsertListElement.find('option[value=""]').prop('selected', true);
    subjectSelector.find('option:selected').prop('selected', false);
    subjectSelector.find('option[value=""]').prop('selected', true);
    subjectSelector.prop("disabled", true);
  }

  function addStudent(user) {
    modifiedUsers[user._id] = user;
    studentsTable.row.add([
      user.name,
      user.surname,
      '<button type="button" name="removeStudent" class="btn btn-danger removeStudent">Rimuovi</button>'
    ]).draw().node().id = user._id;

  }
  
  $('#studentsTable').on('click', 'button.removeStudent', function (e) {
    let toRemove = $(this).closest('tr');
    let idToRemove = toRemove[0].id;

    modifiedUsers[idToRemove].class_id = '';
    if(!usersToInsertList[idToRemove]){
      addToUsersToInsertListElement(modifiedUsers[idToRemove]);
    }

    studentsTable.row(toRemove).remove().draw(false);
  });

  /**
   * 
   */
  function removeStudentFromClass(userId){
    const url = '../api/v1/users/' + userId;
    let data = '{$unset: {class_id: 1 } }'
    let fetchData = {
      method: 'PATCH', 
      body: data,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
    }
    fetch(url, fetchData)
      .then((resp) => {
        if(resp.ok){
          return resp.json();
        }else if(resp.status == 403){
          try{
            refreshToken();
          }catch(error){
            dealWithForbiddenErrorCode();
          }
        } else {
          //dealWithServerErrorCodes();
        }
      })
      .catch( 
        error => console.error(error)
      );
  }
  
  $('#professorsTable').on('click', 'button.removeProfessor', function (e) {
    let toRemove = $(this).closest('tr');
    let subject = parseInt(toRemove[0].childNodes[2].childNodes[0].id, 10);
    let idToRemove = toRemove[0].id;

    //remove from modified
    modifiedUsers[idToRemove].teaches = modifiedUsers[idToRemove].teaches.filter((elem) => {
      return elem.subject !== subject || elem.class_id !== classId;
    });

    professorsTable.row(toRemove).remove().draw(false);
  });
  
  function editUser(user){
    
    let base_url = '../api/v1/users/';
    let data = '';
    let fetchData = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
    }

    return new Promise((resolve,reject) => {
      if(modifiedUsers[user].role == 0){
        data = JSON.stringify({ class_id: modifiedUsers[user].class_id });
      } else {
        data = JSON.stringify({ teaches: modifiedUsers[user].teaches });
      }
      let url = base_url + user; 
      fetchData.body = data;
      fetch(url, fetchData)
      .then((resp) => {
        if(resp.ok){
          resolve();
        }else if(resp.status == 403){
          try{
            refreshToken();
          }catch(error){
            dealWithForbiddenErrorCode();
          }
        } else {
          //dealWithServerErrorCodes();
        }
      })
      .catch( 
        error => {
          console.error(error);
          reject();
        }
      );
    })
  }

  async function editClass(){

    for(const user in modifiedUsers){
      await editUser(user);
    }

    let class_url = '../api/v1/classes/' + classId;
    let data = '{"name": "' + $('#className').val() + '"}';

    let fetchData = {
      method: 'PATCH',
      body: data,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
    }

    fetch(class_url, fetchData)
    .then((resp) => {
      if(resp.ok){
        $(location).prop('href', './classes.html');
      }else if(resp.status == 403){
        try{
          refreshToken();
        }catch(error){
          dealWithForbiddenErrorCode();
        }
      } else {
        //dealWithServerErrorCodes();
      }
    })
    .catch( 
      error => {
        console.error(error);
      }
    );
  }
  
  $('#form').submit((event) => {
    editClass();
    //(modifiedUsers);
    event.preventDefault();
  });

  $('#aggiungi').on('click', function (e) {
    let selectedUserElem = usersToInsertListElement.find('option:selected');
    if (selectedUserElem.val() !== '') {
      let selectedUser = usersToInsertList[selectedUserElem.val()];
      if (selectedUser.role === 1) {
        let subject = subjectSelector.find('option:selected').val();
        if (subject !== '') {
          addProfessorWithAdd(parseInt(subject, 10), selectedUser);
        }
      } else {
        addStudentWithAdd(selectedUser);
      }
    }
  });
  
  function copyUser(user) {
    let copy = {};
    copy._id = user._id;
    copy.name = user.name;
    copy.surname = user.surname;
    copy.email = user.email;
    copy.password = user.password;
    copy.role = user.role;
    copy.birth_date = user.birth_date;
    copy.class_id = classId;
    copy._id = user._id;

    copy.teaches = [];
    for (let i = 0; i < user.teaches.length; i++) {
      copy.teaches[i] = {};
      copy.teaches[i].subject = user.teaches[i].subject;
      copy.teaches[i].class_id = user.teaches[i].class_id;
    }

    return copy;
  }
  
  function teacherTeaches(user, subject, class_id) {
    let i = 0;
    let found = false;
    if (user.teaches) {
      while (!found && i < user.teaches.length) {
        if (user.teaches[i].subject === subject &&
          user.teaches[i].class_id === class_id) {
          found = true;
        }
        i++;
      }
    }
    return found;
  }

  getClass();
  getUsersToInsert();
})(jQuery);