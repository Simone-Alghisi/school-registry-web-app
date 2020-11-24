import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes } from './common.js';

(function ($){
  "use strict";

  let table = $('#dataTable').DataTable();

  function getClasses(){
    fetch('../api/v1/classes', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' +  window.sessionStorage.accessToken}
    })  
    .then((resp) => {
      if(resp.ok){
        return resp.json();
      }else if(resp.status == 403){
        refreshToken().then(() => getClasses()).catch(() => dealWithForbiddenErrorCode());
      }else{
        dealWithServerErrorCodes();
      }
    })
    .then((data) => {
      if(data && !data.error){
        data.map((elem) =>{
          table.row.add([
            elem.name
          ]).draw().node().id = elem._id;
        })
      }
    })
  }

  /**
   * Set the get request to the edit page
   */
  function setEventgetClassById(){
    $('#dataTable tbody').on('click', 'tr', function () {
      let id = table.row(this).node().id;
      $(location).prop('href', './editClass.html?id='+id);
    });
  }

  getClasses();
  setEventgetClassById();
}) (jQuery);