import { getUrlVars, refreshToken, dealWithForbiddenErrorCode } from './common.js';

(function ($) {
  "use strict";

  let classId = getUrlVars()['id'];

  //TODO cancellare insegnanti che insegnano lì o persone che insegnano lì

  /**
   * 
   */
  function deleteClass(){
    const url = '../api/v1/classes/' + classId;
    let fetchData = {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken}
    }
    fetch(url, fetchData)
      .then((resp) => {
        if(resp.ok){
          $(location).prop('href', './classes.html');
        }else if(resp.status == 403){
          refreshToken().catch(() => dealWithForbiddenErrorCode());
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
    deleteClass();
  });
})(jQuery);