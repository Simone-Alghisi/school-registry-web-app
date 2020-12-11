import { getUrlVars, refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes } from './common.js';

(function ($) {
  "use strict";

  // Retrieve the class id
  let classId = getUrlVars()['id'];
  const errorMessage = "error while retrieving data due to refresh token" 

  /**
   * Delete the students' reference to that class
   * @param user 
   */
  async function removeClassReferencesStudents(attemptMade){
    return fetch('../api/v1/users?class_id=' + classId, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken}
    }).then((resp) => {
      if(resp.ok){
        return resp.json();
      }else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => deleteClass(true)).catch(() => dealWithForbiddenErrorCode());
        } else {
          dealWithForbiddenErrorCode();
        }
      }else if(resp.status == 500){
        dealWithServerErrorCodes();
      }
      throw errorMessage
    }).then((users) => {
      if(users){
        users.forEach((u) => {
          deleteStudentReference(u._id,attemptMade).then(() => {return});
        });
      }
    });
  }

  /**
   * Delete the student class_id reference
   * @param userId
   */
  async function deleteStudentReference(userId, attemptMade = false){
    return fetch('../api/v1/users/' + userId, {
      method: 'PATCH',
      body: JSON.stringify({class_id: ''}),
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken}
    }).then((resp) => {
      if(resp.ok){
        return;
      }else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => deleteClass(true)).catch(() => dealWithForbiddenErrorCode());
        } else {
          dealWithForbiddenErrorCode();
        }
      }else if(resp.status == 500){
        dealWithServerErrorCodes();
      }
      throw errorMessage
    })
  }

  /**
   * Delete the professors' reference to that class
   */
  async function removeClassReferencesProfessors(attemptMade){
    return fetch('../api/v1/users?role=1', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken}
    }).then((resp) => {
      if(resp.ok){
        return resp.json();
      }else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => deleteClass(true)).catch(() => dealWithForbiddenErrorCode());
        } else {
          dealWithForbiddenErrorCode();
        }
      }else if(resp.status == 500){
        dealWithServerErrorCodes();
      }
      throw errorMessage;
    }).then((users) => {
      if(users){
        users.forEach((u) => {
          deleteProfessorReference(u, attemptMade).then(() => {return});
        });
      }
    });
  }

  /**
   * Delete the professor teaches reference
   * @param user 
   */
  async function deleteProfessorReference(user, attemptMade = false){
    user.teaches = user.teaches.find( (t) => t.class_id !== classId);
    return fetch('../api/v1/users/' + user._id, {
      method: 'PATCH',
      body: JSON.stringify({teaches: user.teaches}),
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken}
    }).then((resp) => {
      if(resp.ok){
        return;
      }else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => deleteClass(true)).catch(() => dealWithForbiddenErrorCode());
        } else {
          dealWithForbiddenErrorCode();
        }
      }else if(resp.status == 500){
        dealWithServerErrorCodes();
      }
      throw errorMessage;
    })
  }

  /**
   * Remove the classes and the users linked to it
   */
  function deleteClass(attemptMade=false){
    removeClassReferencesStudents(attemptMade)
    .then(() => removeClassReferencesProfessors(attemptMade))
    .then(() => removeClassById(attemptMade))
    .catch(error => {console.log(error)});
  }
  
  async function removeClassById(attemptMade){
    return fetch('../api/v1/classes/' + classId, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken}
    })
    .then((resp) => {
      if(resp.ok){
        return;
      }else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => deleteClass(true)).catch(() => dealWithForbiddenErrorCode());
        } else {
          dealWithForbiddenErrorCode();
        }
      }else if(resp.status == 500){
        dealWithServerErrorCodes();
      }
      throw errorMessage
    }).then(() => {
      $(location).prop('href', './classes.html');
    })
  }

  $('#delete').click((event) => {
    event.preventDefault();
    deleteClass();
  });
})(jQuery);