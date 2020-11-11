import moment from 'moment'

/**
 * CommonMiddleware class
 * It implements some useful method that can check the validity, the type or parse the data passed
 */
export class CommonMiddleware {  
    constructor() {
    }

    /**
   * Function that cast a string value into an integer
   * @param value string value
   * @returns value as a number if possibile
   */
  static stringToNumberCaster(value: string): any{
    if(value === ''){
      return value;
    } else {
      const parsed: number = parseFloat(value);
      return !isNaN(parsed) ? parsed : value;
    }
  }

  /**
   * Function that checks the validity of a field
   * In particular it checks if the field is not empty and if it is of the given type
   * @param value value of the field that needs to be checked
   * @param type type that the field should have 
   * @returns true if the field is valid
   * @returns false if the field is invalid
   */
  static checkValidity(value: any, type: string): boolean {
    let isValid = false;
    if(value != null && value !== '' && typeof value === type){
      isValid = true;
    }
    return isValid;
  }

  /**
   * Function that checks if a string is a valid date.
   * If it has the date format: YYYY-MM-DD
   * @param date string value of a date
   * 
   * @returns true if the date is valid
   * @returns false otherwise
   */
  static isDate(date: string): boolean{
    return moment(date, 'YYYY-MM-DD', true).isValid();
  }
}