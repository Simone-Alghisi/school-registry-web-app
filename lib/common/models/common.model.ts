export class CommonModel {  
    static validateString(value: any):boolean {
        const type:string = typeof(value);
        let isValid = false;
        if(isNaN(Number(value)) && value != null && value !== '' && type === 'string'){
            isValid = true;
        }
        return isValid;
    }

    static isNumber(num: any){
      return !isNaN(parseInt(num)) && isFinite(num);
    }

    static isValidStringDate(date: any){
      if(CommonModel.validateString(date)){
        return date.match(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/);
      }
      return false;
    }
}