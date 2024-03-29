import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes, getYourself } from './common.js';
import { prepareClassOnLoad } from './commonProfessor.js';

(function ($){

  async function loadCommunication(attemptMade=false){
    const urlParams = new URLSearchParams(location.search);
    let commId = urlParams.get("id");
    let userId;
    do{
      userId = await getYourself();
      if(userId){
        userId = userId._id;
      }
    }while(!userId);

    if(commId == null){
      $(location).prop('href', './communicationsProfessor.html');
    }
    const url = '../api/v1/users/' + userId + '/communications/' + commId;
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
          refreshToken().then(() => loadCommunication(true)).catch(() => dealWithForbiddenErrorCode());
        }else{
          dealWithForbiddenErrorCode();
        }
      } else {
        dealWithServerErrorCodes();
      }
    })
    .then(data => {
      if(data){
        $('#communication')
        .append('<div class="col-md-12"><b>Da: </b>' + getSender(data) + '</div><hr>')
        .append('<div class="col-md-12"><b>Oggetto: </b>' + data.subject + '</div><hr>')
        .append('<div class="col-md-12"><b>Inviata il: </b>' + data.date + '</div><hr>')
        .append('<div class="col-md-12">' + data.content + '</div>');
      }
    })
  }

  function getSender(comm){
    if(comm.sender_role === 2){
      return 'segreteria';
    } else {
      return comm.sender;
    }
  }

  prepareClassOnLoad();
  loadCommunication();
})(jQuery);