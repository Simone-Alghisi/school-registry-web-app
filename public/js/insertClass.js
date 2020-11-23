import {
  refreshToken,
  dealWithForbiddenErrorCode,
  dealWithServerErrorCodes
} from './common.js';

(function ($) {
  "use strict";

  //datatables
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
  let usersToInsertList = []; //list of users to insert

  /**
   * Students with a newly assigned _class\_id_ or 
   * professors with a new _(subject, class\_id)_ pair.
   * These users will need to be updated on submission
   */
  let modifiedUsers = [];

  let class_id = 0;

  let subjectSelector = $('#materia');
  subjectSelector.prop("disabled", true);

  //TODO aggiungere tutte le materie, decidendo i valori
  let subjectMapping = {
    0: 'Matematica',
    1: 'Storia',
    2: 'Italiano',
    3: 'Inglese',
    4: 'Informatica'
  }

  //add all subjects
  for (let key in subjectMapping) {
    subjectSelector.append($('<option>').val(key).text(subjectMapping[key]));
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
          dealWithServerErrorCodes();
        }
      })
      .then((data) => {
        data.map((elem) => {
          if ((!elem.class_id && elem.role === 0) || elem.role === 1) {
            usersToInsertListElement.append($('<option>').val(elem._id).text(elem.name + " " + elem.surname));
            usersToInsertList[elem._id] = elem;
          }
        });
      })
  }

  $('#aggiungi').on('click', function (e) {
    let selectedUserElem = usersToInsertListElement.find('option:selected');
    if (selectedUserElem.val() !== '') {
      let selectedUser = usersToInsertList[selectedUserElem.val()];
      if (selectedUser.role === 1) {
        let subject = subjectSelector.find('option:selected').val();
        if (subject !== '') {
          addProfessor(selectedUser, parseInt(subject, 10));
        }
      } else {
        addStudent(selectedUser);
      }
    }
  });

  function copyUser(user) {
    //TODO vedere che campi tenere
    let copy = {};
    copy._id = user._id;
    copy.name = user.name;
    copy.surname = user.surname;
    copy.email = user.email;
    copy.password = user.password;
    copy.role = user.role;
    copy.birth_date = user.birth_date;
    copy.class_id = user.class_id;
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

  function addProfessor(user, subject) {
    //add professor to modified users, only if not already modified or new (subject,class)
    let canAdd = false;
    if (!modifiedUsers[user._id]) {
      modifiedUsers[user._id] = copyUser(user);
      canAdd = true;
    } else if (!teacherTeaches(modifiedUsers[user._id], subject, class_id)) {
      canAdd = true;
    }

    if (canAdd) {
      //add the pair (subject,class_id)
      let teach = {};
      teach.subject = subject;
      teach.class_id = class_id;
      modifiedUsers[user._id].teaches.push(teach);
      //add to professor table
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

  function addStudent(user) {
    //add student to modified users, only if not already modified
    if (!modifiedUsers[user._id]) {
      modifiedUsers[user._id] = copyUser(user);
      //set class_id of the student
      modifiedUsers[user._id].class_id = class_id;
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

  //event attached to the table, but executed by buttons with class .removeProfessor
  $('#professorsTable').on('click', 'button.removeProfessor', function (e) {
    let toRemove = $(this).closest('tr');
    let subject = parseInt(toRemove[0].childNodes[2].childNodes[0].id, 10);
    let idToRemove = toRemove[0].id;

    //remove from modified
    modifiedUsers[idToRemove].teaches = modifiedUsers[idToRemove].teaches.filter((elem) => {
      return elem.subject !== subject || elem.class_id !== class_id;
    });

    professorsTable.row(toRemove).remove().draw(false);
  });

  $('#studentsTable').on('click', 'button.removeStudent', function (e) {
    let toRemove = $(this).closest('tr');
    let idToRemove = toRemove[0].id;

    //remove from modified
    delete modifiedUsers[idToRemove];

    studentsTable.row(toRemove).remove().draw(false);
  });

  function getTeachesJson(user) {
    let tJson = '[';
    if (user.teaches) {
      for (let i = 0; i < user.teaches.length; i++) {
        if (i != 0) tJson += ',';
        tJson += '{"subject": ' + user.teaches[i].subject +
          ', "class_id": "' + user.teaches[i].class_id + '"}';
      }
    }
    tJson += ']';
    return tJson;
  }

  function editUser(user) {
    return new Promise((resolve, reject) => {
      const url = '../api/v1/users/' + user._id;
      // The data we are going to send in our request
      let data;
      if(user.role == 0){
        data = JSON.stringify({ class_id: user.class_id });
      } else {
        data = JSON.stringify({ teaches: user.teaches });
      }
      // The parameters we are gonna pass to the fetch function

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
            return resp.json();
          } else if (resp.status == 403) {
            refreshToken().catch(() => dealWithForbiddenErrorCode());
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

  function createClass() {
    const url = '../api/v1/classes/';
    let name = $('#className').val();
    // The data we are going to send in our request
    let data = '{"name": "' + name + '"}';
    // The parameters we are gonna pass to the fetch function
    let fetchData = {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.sessionStorage.accessToken
      }
    }
    fetch(url, fetchData)
      .then(async (resp) => {
        if (resp.ok) {
          class_id = resp.headers.get('location').split('/')[3];
          //once received the class id, edit users appropriately
          for (let id in modifiedUsers) {
            correctClassId(id);
            await editUser(modifiedUsers[id]);
          }
          //redirect to classes list
          $(location).prop('href', './classes.html');
        } else if (resp.status == 403) {
          refreshToken().catch(() => dealWithForbiddenErrorCode());
        } else {
          dealWithServerErrorCodes();
        }
      })
      .catch(
        error => console.error(error)
      );
  }

  function correctClassId(id) {
    if (modifiedUsers[id].role === 0) {
      modifiedUsers[id].class_id = class_id;
    } else if (modifiedUsers[id].role === 1) {
      let length = modifiedUsers[id].teaches.length;
      for (let i = 0; i < length; i++) {
        if (modifiedUsers[id].teaches[i].class_id === 0) {
          modifiedUsers[id].teaches[i].class_id = class_id;
        }
      }
    }
  }

  $('#form').submit((event) => {
    createClass();
    event.preventDefault();
  });

  getUsersToInsert();

})(jQuery);