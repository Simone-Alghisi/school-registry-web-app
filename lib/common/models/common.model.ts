export class CommonModel {  
    
    static validateString(value: any):boolean {
    const type:string = typeof(value);
    let isValid = false;
    if(isNaN(Number(value)) && value != null && value !== '' && type === 'string'){
        isValid = true;
    }
    return isValid;
    }
}