export { getUrlVars, dealWithForbiddenErrorCode, refreshToken, dealWithServerErrorCodes, dealWithAlreadyLoggedUser, getYourself };

function refreshToken(){
  return new Promise((resolve, reject) => {
    const url = '../api/v1/login/refresh';
    let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({refreshToken: window.sessionStorage.refreshToken})
  }
  fetch(url, options)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      if(data.error){
        throw "Could not refresh the token";
      }
      window.sessionStorage.accessToken = data.accessToken;
      resolve();
    })
    .catch((error) =>{
      console.error(error);
      reject();
    });
  });
}


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

function dealWithForbiddenErrorCode(){
  $(location).prop('href', './forbidden.html');
}

function dealWithServerErrorCodes(){
  $(location).prop('href', './serverError.html');
}

function dealWithAlreadyLoggedUser(){
  $(location).prop('href', './home.html');
}

/**
 * Get the the _/yourself_ resource for the current user
 * @param {*} attemptMade param used for refresh token 
 */
function getYourself(attemptMade=false){
  return new Promise( (resolve,reject) => {
    const url = '../api/v1/yourself'
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
          refreshToken().then(() => getid(true)).catch(() => dealWithForbiddenErrorCode());
        }else{
          dealWithForbiddenErrorCode();
        }
      } else {
        dealWithServerErrorCodes();
      }
    })
    .then(data => {
      resolve(data);
    });
  });
}