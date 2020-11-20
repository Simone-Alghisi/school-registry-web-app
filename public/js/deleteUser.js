import { getUrlVars, refreshToken, dealWithForbiddenErrorCode } from './common.js';

(function ($) {
  "use strict";

  let userId = getUrlVars()['id'];

  /**
   * Function that deletes an user
   */
  function deleteUser(){
    const url = '../api/v1/users/' + userId;
    let fetchData = {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken}
    }
    fetch(url, fetchData)
      .then((resp) => {
        if(resp.ok){
          $(location).prop('href', './users.html');
        }else if(resp.status == 403){
          try{
            refreshToken();
          }catch(error){
            dealWithForbiddenErrorCode();
          }
        }else{
          dealWithServerErrorCodes();
        }
      })
      .catch( 
        error => console.error(error)
      );
  }
  
  $('#delete').click((event) => {
    event.preventDefault();
    deleteUser();
  });
})(jQuery);