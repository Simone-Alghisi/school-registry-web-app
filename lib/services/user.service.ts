import { CRUDService } from '../common/interfaces/crudService.interface';
import { UserModel } from '../models/user.model';
import * as crypto from 'crypto';

/**
 * Semplicemente la classe intermedia che interagisce con il model
 */
export class UserService implements CRUDService {
  private static instance: UserService;
  userModel: UserModel; 

  constructor(){ 
    this.userModel = UserModel.getInstance();
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async create(resource: any) : Promise<any>{
    resource.salt = crypto.randomBytes(32).toString('base64');
    const hash = crypto.createHmac('sha512', resource.salt).update(resource.password).digest('base64');
    resource.password = hash + resource.salt;
    const user = new this.userModel.userCollection(resource);
    await user.save();
    return resource._id;
  }

  async deleteById(resourceId: string): Promise<void>{
    await this.userModel.userCollection.deleteOne({_id: resourceId});
  }

  async list(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.userModel.userCollection.find().select(['-password', '-salt', '-__v'])
        .exec(function (err, users) {
          if (err) {
            reject(err);
          } else {
            resolve(users);
          }
        })
    });
  }

  async updateById(resource: any): Promise<any>{
    await this.userModel.userCollection.updateOne({_id: resource.id}, resource);
    return await this.getById(resource.id);
  }

  async getById(resourceId: string): Promise<any>{
    const user = await this.userModel.userCollection.findById(resourceId).select(['-password', '-salt', '-__v']);
    return user;
  }

  async getByEmail(email: string): Promise<any>{
    return await this.userModel.userCollection.findOne({email: email});
  }
}