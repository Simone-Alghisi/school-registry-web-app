export class CommonController {  
    constructor() {
    }
  
    checkValidity(type: string, value: any): boolean {
      console.log('ciao');
      let isValid = false;
      if(value != null && value != "" && typeof value === type){
        isValid = true;
        if(type == "number"){
          isValid = value == parseInt(value, 10);
        }
      }
      return isValid;
    }
  }