import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes } from './common.js';

(function ($) {
  "use strict";
  
  /**
   * Function that sends the user data as a json to the RESTFUL api to add the user
   */
  function addUser(){
    const url = '../api/v1/users/';
    // The data we are going to send in our request
    let data = '{"name": "'+ $('#name').val() + '", "surname": "' + $('#surname').val() + '", "email": "' + $('#email').val() + '", "password": "'
    + $('#password').val() + '", "role": ' + $('#role').val() + ', "birth_date": "' + $('#birth_date').val() + '"}'
    // The parameters we are gonna pass to the fetch function
    let fetchData = {
      method: 'POST', 
      body: data,
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken}
    }
    fetch(url, fetchData)
      .then(() => {
        if(resp.ok){
          $(location).prop('href', './users.html');
        }else if(resp.status == 403){
          try{
            refreshToken();
          }catch(error){
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

  $('#form').submit((event) => {
    addUser();
    event.preventDefault();
  });
})(jQuery);
