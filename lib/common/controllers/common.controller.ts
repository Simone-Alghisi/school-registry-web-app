export class CommonController {  
  constructor() {
  }

  static caster(value: string): any{
    if(value === ''){
      return value;
    } else {
      const parsed: number = parseFloat(value);
      return !isNaN(parsed) ? parsed : value;
    }
  }

  static checkValidity(value: any, type: string): boolean {
    let isValid = false;
    if(value != null && value !== "" && typeof value === type){
      isValid = true;
    }
    return isValid;
  }
}