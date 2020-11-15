(function ($) {
  "use strict";
  
  let userId = getUrlVars()['id'];

  /**
   * Function that gets the params in the url
   */
  function getUrlVars(){
    let vars = [], hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  /**
   * Function that deletes an user
   */
  function deleteUser(){
    const url = '../api/v1/users/' + userId;
    let fetchData = {
      method: 'DELETE'
    }
    fetch(url, fetchData)
      .then((resp) => {
        $(location).prop('href', './users.html');
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