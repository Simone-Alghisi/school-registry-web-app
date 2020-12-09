import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes, getYourself } from './common.js';

(function ($){
  let table = $('#dataTable').DataTable();

  async function getCommunications(attemptMade=false){
    let userId = (await getYourself())._id;

    const url = '../api/v1/users/' + userId + '/communications'
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
          getSender(elem)
        ]).draw().node().id=elem._id;
      })
    })
  }

  function getSender(comm){
    if(comm.sender_role === 2){
      return 'segreteria';
    } else {
      return comm.sender;
    }
  }

  $('#dataTable tbody').on('click', 'tr', function(e){
    let commId = table.row(this).node().id;
    $(location).prop('href', './viewCommunicationStudent.html?id='+commId);
  });

  getCommunications();
})(jQuery);