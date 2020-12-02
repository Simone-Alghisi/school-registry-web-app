/**
 * CommonModel class
 * It implements some useful method that can check the validity, of some data that 
 * needs to be inserted into the database
 */
export class CommonModel {  

  /**
   * Function that checks if the given value is a string
   * @param value 
   * 
   * @returns true if the value is a valid string
   * @returns false if the value is not a valid string
   */
  static validateString(value: any):boolean {
    const type:string = typeof(value);
    let isValid = false;
    if(isNaN(Number(value)) && value != null && value !== '' && type === 'string'){
      isValid = true;
    }
    return isValid;
  }

  /**
   * Function that checks if the given value is a valid number
   * @param num 
   * 
   * @returns true if it is
   * @returns false if it is not
   */
  static isNumber(num: any): boolean{
    return !isNaN(parseInt(num)) && isFinite(num);
  }

  /**
   * Check if the given string is a valid date in the following format: YYYY-MM-DD
   * @param date 
   * 
   * @returns true if it is a valid date
   * @returns false if it is not
   */
  static isValidStringDate(date: any): boolean{
    if(CommonModel.validateString(date)){
    return date.match(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/);
    }
    return false;
  }
}