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
   * 
   */
  function getUser(){
    fetch('../api/v1/users/' + userId)
    .then((resp) => resp.json())
    .then(function (data) {
      if(!data.error){
        $('#name').val(data.name);
        $('#surname').val(data.surname);
        $('#email').val(data.email);
        $('#password').val(data.password);
        $('#birth_date').val(data.birth_date);
        $('#role').val(data.role);
      }else{
        $(location).prop('href', './users.html');
      }
    })
    .catch(
      error => console.error(error)
    );
  }
  
  /**
   * 
   */
  function editUser(){
    const url = '../api/v1/users/' + userId;
    // The data we are going to send in our request
    let data = '{"name": "'+ $('#name').val() + '", "surname": "' + $('#surname').val() + '", "email": "' + $('#email').val() + '", "password": "'
    + $('#password').val() + '", "role": ' + $('#role').val() + ', "birth_date": "' + $('#birth_date').val() + '"}'
    // The parameters we are gonna pass to the fetch function
    let fetchData = {
      method: 'PATCH', 
      body: data,
      headers: {'Content-Type': 'application/json'}
    }
    fetch(url, fetchData)
      .then((resp) => {
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