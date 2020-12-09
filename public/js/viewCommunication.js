import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes } from './common.js';

(function ($){

  function loadCommunication(attemptMade=false){
    const urlParams = new URLSearchParams(location.search);
    let commId = urlParams.get("id");
    if(commId == null){
      $(location).prop('href', './communications.html');
    }
    const url = '../api/v1/communications/' + commId;
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
      $('#communication')
      .append('<div class="col-md-12"><b>A: </b>' + 'DESTINATARIO' + '</div><hr>')
      .append('<div class="col-md-12"><b>Oggetto: </b>' + data.subject + '</div><hr>')
      .append('<div class="col-md-12"><b>Inviata il: </b>' + 'GG-MM-AAAA' + '</div><hr>')
      .append('<div class="col-md-12">' + data.content + '</div>');
    })
  }

  loadCommunication();
})(jQuery);