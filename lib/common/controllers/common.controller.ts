export class CommonController {  
  constructor() {
  }

  static checkValidity(value: any, type: string): boolean {
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