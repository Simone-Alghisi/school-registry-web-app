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
        dropdown.append('<option class="item" data-value="' + user._id + '">' + user.name + ' ' + user.surname + '</option>')
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

  setUsersInDropdown();

})(jQuery);