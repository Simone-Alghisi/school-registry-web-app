import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes } from './common.js';

(function ($){
  let table = $('#dataTable').DataTable();

  function getCommunications(attemptMade=false){
    const url = '../api/v1/communications'
    fetch(url,{
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.accessToken
      }
    })
    .then(resp => {
      if(resp.ok){
        return resp.json();
      }else if(resp.status == 403){
        if(!attemptMade){
          refreshToken().then(() => getCommunications(true)).catch(() => dealWithForbiddenErrorCode());
        }else{
          dealWithForbiddenErrorCode();
        }
      } else {
        dealWithServerErrorCodes();
      }
    })
    .then(data => {
      data.map(elem => {
        table.row.add([
          elem.subject,
          "DESTINATARIO"
        ]).draw().node().id=elem._id;
      })
    })
  }

  $('#dataTable tbody').on('click', 'tr', function(e){
    let commId = table.row(this).node().id;
    $(location).prop('href', './viewCommunication.html?id='+commId);
  });

  getCommunications();
})(jQuery);