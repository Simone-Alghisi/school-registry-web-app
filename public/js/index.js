import { refreshToken, dealWithServerErrorCodes, dealWithAlreadyLoggedUser, dealWithForbiddenErrorCode } from './common.js';

(function ($) {
    "use strict";
  
    /**
     * Function that sends the user data as a json to the RESTFUL api to add the user
     */
    function login(){
      const url = '../api/v1/login';
      // The data we are going to send in our request
      let data = '{"email": "'+ $('#email').val() + '", "password": "' + $('#password').val() + '"}'
      // The parameters we are gonna pass to the fetch function
      let fetchData = {
        method: 'POST', 
        body: data,
        headers: {'Content-Type': 'application/json'}
      }
      fetch(url, fetchData)
        .then((resp) => {
          //console.log(resp.status);
          if(resp.ok) {
            return resp.json();
          } else if(resp.status == 401) {
            $('#loginError').text("Email e/o password non corretti");
          } else {
            dealWithServerErrorCodes();
          }
        })
        .then((data) => {
          if(data){
            window.sessionStorage.accessToken = data.accessToken;
            window.sessionStorage.refreshToken = data.refreshToken;
            let fetchData = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
            }
            fetch('../api/v1/users', fetchData)
              .then((resp) => {
                if(resp.ok) {
                  return resp.json();
                } else {
                  dealWithServerErrorCodes();
                }
              })
              .then((data) => {
                if(data.length > 1){
                  $(location).prop('href', './home.html');
                } else {
                  data = data[0];
                  if(data.role === 0){
                    //TODO... homepage for the user
                  } else if(data.role === 1){
                    $(location).prop('href', './homeProfessor.html');
                  } else {
                    dealWithForbiddenErrorCode();
                  }
                }
              })
          }
        })
        .catch( 
          error => console.error(error)
        );
    }
  
    $('#form').submit((event) => {
      login();
      event.preventDefault();
    });

    /**
     * Function that checks if the user can be already logged in
     */
    function alreadyLogged(){
      // Try to get another token from the refresh token
      if(window.sessionStorage.refreshToken){
        try{
          refreshToken().then(() => dealWithAlreadyLoggedUser());
        }catch(e){ }
      }
    }

    alreadyLogged();
  })(jQuery);