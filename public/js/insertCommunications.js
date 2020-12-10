import {
  refreshToken,
  dealWithForbiddenErrorCode,
  dealWithServerErrorCodes
} from './common.js';

(function ($) {
  "use strict";

  let users;

  function setUsersInDropdown(){
    let dropdown = $('#multi-select');

    getUsers().then(() => {
      let user; 
      for(const key in users){
        user = users[key];
        if(user.role != 2){
          dropdown.append('<option class="item" value="' + user._id + '">' + user.name + ' ' + user.surname + '</option>')
        }
      }
    });

    dropdown.dropdown();
  }

  /**
   * Fetch all the users from the RESTFUL api
   * And load them into the table in the users.html page
   */
  function getUsers(attemptMade = false){
    return fetch('../api/v1/users', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
    })
    .then((resp) => {
      if(resp.ok){
        return resp.json();
      }else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => getUsers(true)).catch(() => dealWithForbiddenErrorCode());
        } else {
          dealWithForbiddenErrorCode();
        }
      } else {
        dealWithServerErrorCodes();
      }
    })
    .then(function (data) {
      if(data && !data.error){
        users = data;
      }
    })
    .catch(
      error => console.error(error)
    );
  }

  async function sendNewCommunications() {
    const selectedUsersElem = $('#multi-select').dropdown('get value');
    const subject = $('#subject').val();
    const content = $('#message').val();
    const date = getYYYYMMDDDate();
    for(const key in selectedUsersElem){
      await sendNewCommunicationToUser(selectedUsersElem[key], date, subject, content)
    }
  }

  async function sendNewCommunicationToUser(recipient, date, subject, content, attemptMade = false){
    let data = '{"subject": "' + subject +'", "content": "' + content +'", "date": "' + date +'"}'
    let fetchData = {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.sessionStorage.accessToken
      }
    }
    return fetch('../api/v1/users/' + recipient + '/communications', fetchData)
    .then((resp) => {
      if(resp.ok){
        return;
      }else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => sendNewCommunicationToUser(recipient, date, subject, content, true)).catch(() => dealWithForbiddenErrorCode());
        } else {
          dealWithForbiddenErrorCode();
        }
      } else {
        dealWithServerErrorCodes();
      }
    })
    .catch(
      error => console.error(error)
    );
  }

  function getYYYYMMDDDate(){
    let now = new Date();
    return now.getFullYear() + '-' + now.getMonth() + '-' + now.getDay();
  }

  $('#form').submit((event) => {
    event.preventDefault();
    sendNewCommunications().then(() => $(location).prop('href', './communications.html'));
  });



  setUsersInDropdown();

})(jQuery);