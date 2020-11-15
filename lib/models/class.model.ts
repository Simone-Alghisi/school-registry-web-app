import { Schema } from 'mongoose';
import { MongooseService } from '../common/services/mongoose.service';
import { CommonModel } from '../common/models/common.model'

export class ClassModel {
  mongooseService: MongooseService = MongooseService.getInstance();
  private static instance: ClassModel;

  dbSchema = this.mongooseService.getMongoose().Schema;

  classSchema: Schema = new this.dbSchema({
    name: { 
      type: String,
      validate: {
        validator: CommonModel.validateString,
        message: 'Invalid name'
      },
      required: true
    }, 
    schedule: [{
			start_hour: {
				type: Number,
				required: true
			}, 
			start_minute: {
				type: Number,
				required: true
			}, 
			end_hour: {
				type: Number,
				required: true
			},
			end_minute: {
				type: Number,
				required: true
			}, 
			subject: {
				type: String, 
				required: true,
				validate: {
					validator: CommonModel.validateString,
					message: 'Invalid subject'
				}
			}, 
			professor_id: {
				type: Schema.Types.ObjectId, 
				ref: 'users',
				required: true
			}
		}], 
		communictions: [{
			sender_id: {
				type: Schema.Types.ObjectId, 
				ref: 'users',
				required: true
			},
			messages:[{
				subject: {
					type: String, 
					required: true
				}, 
				content: {
					type: String, 
					required: true
				}
			}]
		}],
		homeworks: [{
			subject: {
				type: Number, 
				required: true
			},
			title: {
				type: String, 
				required: true
			},
			description: {
				type: String, 
				required: true
			},
			date: {
				type: String, 
				required: true,
				validate: {
					validator: CommonModel.validateString,
					message: 'Invalid homework date'
				},
				// eslint-disable-next-line
				match: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
			}
		}], 
		tests: [{
			subject: {
				type: Number, 
				required: true
			},
			title: {
				type: String, 
				required: true
			},
			description: {
				type: String, 
				required: true
			},
			date: {
				type: String, 
				required: true,
				validate: {
					validator: CommonModel.validateString,
					message: 'Invalid test date'
				},
				// eslint-disable-next-line
				match: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
			}
		}],	
		material: [{
			subject: {
				type: Number, 
				required: true
			},
			description: {
				type: String, 
				required: true
			}
		}],
		grades_list: [{
			subject: {
				type: Number, 
				required: true
			},
			students: [{
				student_id: {
					type: Schema.Types.ObjectId, 
					ref: 'users',
					required: true
				}, 
				grades: [{
					value: {
						type: Number, 
						required: true
					}, 
					date: {
						type: String, 
						required: true,
						validate: {
							validator: CommonModel.validateString,
							message: 'Invalid grade date'
						},
						// eslint-disable-next-line
						match: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
					}, 
					subject: {
						type: String, 
						required: true
					}
				}]
			}]
		}]
  });

  classCollection = this.mongooseService.getMongoose().model('classes', this.classSchema);

  constructor(){}

  public static getInstance(): ClassModel{
    if (!this.instance) {
      this.instance = new ClassModel();
    }
    return this.instance;
  }

  public isValidId(id:string): boolean{
    return this.mongooseService.isValidId(id);
  } 
}