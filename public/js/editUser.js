import { getUrlVars, refreshToken, dealWithForbiddenErrorCode } from './common.js';

(function ($) {
  "use strict";

  let userId = getUrlVars()['id'];

  /**
   * 
   */
  function getUser(attemptMade = false){
    fetch('../api/v1/users/' + userId, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
    })
    .then((resp) => {
      if(resp.ok){
        return resp.json();
      }else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => getUser(true)).catch(() => dealWithForbiddenErrorCode());
        }else{
          dealWithForbiddenErrorCode();
        }        
      } else {
        dealWithServerErrorCodes();
      }
    })
    .then(function (data) {
      if(data && !data.error){
        $('#name').val(data.name);
        $('#surname').val(data.surname);
        $('#email').val(data.email);
        $('#password').val(data.password);
        $('#birth_date').val(data.birth_date);
        $('#role').val(data.role);
      }
    })
    .catch(
      error => console.error(error)
    );
  }
  
  /**
   * 
   */
  function editUser(attemptMade = false){
    const url = '../api/v1/users/' + userId;
    // The data we are going to send in our request
    let data = '{"name": "'+ $('#name').val() + '", "surname": "' + $('#surname').val() + '", "email": "' + $('#email').val() + '", "password": "'
    + $('#password').val() + '", "role": ' + $('#role').val() + ', "birth_date": "' + $('#birth_date').val() + '"}'
    // The parameters we are gonna pass to the fetch function
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
          if(!attemptMade){
            refreshToken().then(() => editUser(true)).catch(() => dealWithForbiddenErrorCode());
          }else{
            dealWithForbiddenErrorCode();
          }
        } else {
          dealWithServerErrorCodes();
        }
      })
      .then(() => {
        $(location).prop('href', './users.html');
      })
      .catch( 
        error => console.error(error)
      );
  }
  
  $('#form').submit((event) => {
    editUser();
    event.preventDefault();
  });

  getUser();
})(jQuery);