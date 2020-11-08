export class CommonController {  
  constructor() {
  }

  static caster(value: string): any{
    const parsed: number = parseFloat(value);
    return parsed !== NaN ? parsed : value;
  }

  static checkValidity(value: any, type: string): boolean {
    let isValid = false;
    if(value != null && value !== "" && typeof value === type){
      isValid = true;
    }
    return isValid;
  }
}