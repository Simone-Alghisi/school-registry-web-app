(function ($){
  "use strict";

  let table = $('#dataTable').DataTable();

  function getClasses(){
    fetch('../api/v1/classes')  
    .then((resp) => resp.json())
    .then((data) => {
      data.map((elem) =>{
        table.row.add([
          elem.name
        ]).draw().node().id = elem._id;
      })
    })
  }

  getClasses();
}) (jQuery);