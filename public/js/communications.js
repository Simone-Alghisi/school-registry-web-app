import { refreshToken, dealWithForbiddenErrorCode, dealWithServerErrorCodes } from './common.js';

(function ($){
  let table = $('#dataTable').DataTable();

  let userName = [];

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
    .then(function(data){
      if(data){
        let unique = getUnique(data);
        unique.map(async function(elem){
          let name = await getRecipientString(await replaceRecipientWithName(elem.recipient)
            .catch((error) => {
            throw error;
          }))
          .catch((error) => {
            throw error;
          });

          table.row.add([
            elem.subject,
            name
          ]).draw().node().id=elem._id;

        }).catch((error) => {
          throw error;
        })
        alreadyLoaded = [];
      }
    })
    .catch((error) => {
      console.log('Token expired: Error trying to fetch the communications')
    })
  }

  /**
   * Remove duplicate communications and merge recipients
   * @param {*} data 
   */
  function getUnique(data){
    let unique = [];
    
    data.map(elem => {
      let found = false;
      let i = 0;

      while(i < unique.length && !found){
        if(elem.subject === unique[i].subject &&
           elem.content === unique[i].content &&
           elem.date === unique[i].date &&
           elem.sender === unique[i].sender &&
           elem.sender_role === unique[i].sender_role){
          found = true;
        } else{
          i++;
        }
      }
      if(!found){
        
        unique.push({
          _id: elem._id,
          subject: elem.subject,
          content: elem.content,
          date: elem.date,
          sender: elem.sender,
          sender_role: elem.sender_role,
          recipient: [elem.recipient]
        });
      } else {
        unique[i].recipient.push(elem.recipient);
      }
    });

    return unique;
  }

  async function replaceRecipientWithName(recipient){
    let rec = [];
    for(let j = 0; j < recipient.length; j++){
      if(userName[recipient[j]]){
        rec[j] = userName[recipient[j]];
      } else {
        userName[recipient[j]] = rec[j] = await getName(recipient[j]).catch(() => {
          throw 'Error';
        });
      }
    }
    return rec;
  }

  function getName(userId,attemptMade=false){
    return new Promise((resolve,reject) => {
      const url = '../api/v1/users/' + userId;
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
            refreshToken().then(() => getName(userId, true)).catch(() => dealWithForbiddenErrorCode());
          }else{
            dealWithForbiddenErrorCode();
          }
        } else {
          dealWithServerErrorCodes();
        }
      })
      .then(data => {
        if(data){
          resolve(data.name + ' ' + data.surname);
        }else{
          throw 'Get name error';
        }
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  async function getRecipientString(recipients){
    let recStr = '';
    
    for(let i = 0; i < recipients.length -1; i++){
      recStr += recipients[i] + ', ';
    }
    recStr += recipients[recipients.length-1];

    return recStr;
  }

  $('#dataTable tbody').on('click', 'tr', function(e){
    let commId = table.row(this).node().id;
    let recipients = table.row(this).node().children[1].textContent;
    $(location).prop('href', './viewCommunication.html?id='+commId+'&recipients='+recipients);
  });

  getCommunications();
})(jQuery);