(function ($) {
    "use strict";
  
    /**
     * Function that sends the user data as a json to the RESTFUL api to add the user
     */
    function login(){
      const url = '../api/v1/login';
      // The data we are going to send in our request
      let data = '{"email": "'+ $('#email').val() + '", "password": "' + $('#password').val() + '"}'
      // The parameters we are gonna pass to the fetch function
      let fetchData = {
        method: 'POST', 
        body: data,
        headers: {'Content-Type': 'application/json'}
      }
      fetch(url, fetchData)
        .then((resp) => {
					console.log(resp.status);
					if(resp.status === 200)
						$(location).prop('href', './users.html');
					else
						$('#loginError').text("Email e/o password non corretti");
        })
        .catch( 
          error => console.error(error)
        );
    }
  
    $('#form').submit((event) => {
			login();
			event.preventDefault();
    });
  })(jQuery);