import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes } from './common.js';

(function ($) {
  "use strict";

  /**
   * Mapping of the roles
   */
  let roleMapping = {
    0: "Student*",
    1: "Professor*",
    2: "Segretari*"
  }

  /**
   * table 
   */
  let table = $('#dataTable').DataTable();

  /**
   * Set the get request to the edit page
   */
  function setEventgetUserById(){
    $('#dataTable tbody').on('click', 'tr', function () {
      let id = table.row(this).node().id;
      $(location).prop('href', './editUser.html?id='+id);
    });
  }

  /**
   * Fetch all the users from the RESTFUL api
   * And load them into the table in the users.html page
   */
  function getUsers(){
    fetch('../api/v1/users', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken }
    })
    .then((resp) => {
      if(resp.ok){
        return resp.json();
      }else if(resp.status == 403){
        refreshToken().then(() => getUsers()).catch(() => dealWithForbiddenErrorCode());
      } else {
        dealWithServerErrorCodes();
      }
    })
    .then(function (data) {
      if(data && !data.error){
        data.map((elem) => {
          table.row.add([
            elem.name, 
            elem.surname, 
            elem.birth_date, 
            roleMapping[elem.role]
          ]).draw().node().id = elem._id;
        })
      }
    })
    .catch(
      error => console.error(error)
    );
  }
  
  getUsers();
  setEventgetUserById();
})(jQuery);