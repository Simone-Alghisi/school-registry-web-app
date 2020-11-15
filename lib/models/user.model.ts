import { Schema } from 'mongoose';
import { MongooseService } from '../common/services/mongoose.service';

function validateString(value: any):boolean {
  const type:string = typeof(value);
  let isValid = false;
  if(isNaN(Number(value)) && value != null && value !== '' && type === 'string'){
    isValid = true;
  }
  return isValid;
}

export class UserModel {
  mongooseService: MongooseService = MongooseService.getInstance();
  private static instance: UserModel;

  dbSchema = this.mongooseService.getMongoose().Schema;

  userSchema: Schema = new this.dbSchema({
    name: { 
      type: String,
      validate: {
        validator: validateString,
        message: 'Invalid name'
      },
      required: true
    },
    surname: { 
      type: String, 
      required: true,
      validate: {
        validator: validateString,
        message: 'Invalid surname'
      }
    },
    email: { 
      type: String, 
      required: true,
      unique: true,
      validate: {
        validator: validateString,
        message: 'Invalid email'
      },
      // eslint-disable-next-line
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { 
      type: String,
      validate: {
        validator: validateString,
        message: 'Invalid password'
      },
      required: true 
    },
    salt: { 
      type: String, 
      validate: {
        validator: validateString,
        message: 'Invalid salt'
      },
      required: true 
    },
    role: { 
      type: Number, 
      required: true, 
      min: 0,
      max: 2
    },
    birth_date: { 
      type: String, 
      required: true,
      validate: {
        validator: validateString,
        message: 'Invalid birth_date'
      },
      // eslint-disable-next-line
      match: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
    }
  });

  userCollection = this.mongooseService.getMongoose().model('users', this.userSchema);

  constructor(){}

  public static getInstance(): UserModel{
    if (!this.instance) {
      this.instance = new UserModel();
    }
    return this.instance;
  }

  public isValidId(id:string): boolean{
    return this.mongooseService.isValidId(id);
  } 
}