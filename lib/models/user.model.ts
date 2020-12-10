import { Schema } from 'mongoose';
import { Types } from 'mongoose';
import { MongooseService } from '../common/services/mongoose.service';
import { CommonModel } from '../common/models/common.model'

/**Class which specifies the schema for a user in the DB */
export class UserModel {
  /**
   * MongooseService instance
   */
  mongooseService: MongooseService = MongooseService.getInstance();
  /**
   * UserModel instance
   */
  private static instance: UserModel;

  /**
   * DatabaseSchema
   */
  dbSchema = this.mongooseService.getMongoose().Schema;

  /**
   * User resource schema
   */
  userSchema: Schema = new this.dbSchema({
    name: { 
      type: String,
      validate: {
        validator: CommonModel.validateString,
        message: 'Invalid name'
      },
      required: true
    },
    surname: { 
      type: String, 
      required: true,
      validate: {
        validator: CommonModel.validateString,
        message: 'Invalid surname'
      }
    },
    email: { 
      type: String, 
      required: true,
      unique: true,
      validate: {
        validator: CommonModel.validateString,
        message: 'Invalid email'
      },
      // eslint-disable-next-line
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { 
      type: String,
      validate: {
        validator: CommonModel.validateString,
        message: 'Invalid password'
      },
      required: true 
    },
    salt: { 
      type: String, 
      validate: {
        validator: CommonModel.validateString,
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
        validator: CommonModel.validateString,
        message: 'Invalid birth_date'
      },
      // eslint-disable-next-line
      match: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
    },
    class_id:{
      type: Types.ObjectId,
      ref: 'classes',
      required: false
    },
    teaches:[
      {
        class_id: {
          type: Types.ObjectId,
          ref: 'classes',
          required: true
        },
        subject: { 
          type: Number,
          required: true
        }
      }
    ],
    communications:[
      {
        sender: String,
        sender_role: Number,
        subject: String,
        content: String,
        date: {
          type: String,
          validate: {
            validator: CommonModel.validateString,
            message: 'Invalid date'
          },
          // eslint-disable-next-line
          match: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
        }
      }
    ]
   });

  /**
   * User model
   */
  userCollection = this.mongooseService.getMongoose().model('users', this.userSchema);

  constructor(){}

  /**
   * Function which returns the instance of UserModel class
   */
  public static getInstance(): UserModel{
    if (!this.instance) {
      this.instance = new UserModel();
    }
    return this.instance;
  }

  /**
   * Function that validates a mongoose.Types.ObjectId value
   * 
   * @param id 
   * 
   * @returns true if valid
   * @returns false if not valid
   */
  public isValidId(id:string): boolean{
    return Types.ObjectId.isValid(id);
  } 
}