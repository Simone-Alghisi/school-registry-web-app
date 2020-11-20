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
        refreshToken().catch(() => dealWithForbiddenErrorCode());
      }else{
        dealWithServerErrorCodes();
      }
    })
    .then((data) => {
      if(!data.error){
        data.map((elem) =>{
          table.row.add([
            elem.name
          ]).draw().node().id = elem._id;
        })
      }
    })
  }

  getClasses();
}) (jQuery);