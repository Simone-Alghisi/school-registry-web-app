import { CRUDService } from '../common/interfaces/crudService.interface';
import { UserModel } from '../models/user.model';
import * as crypto from 'crypto';

/**
 * UserService class, it implements the {@link CRUDService} interface.
 * It aims to manage all the operations that involve the _user_ resource
 * by interacting with the database
 */
export class UserService implements CRUDService {
  /**
   * UserService instance
   */
  private static instance: UserService;
  /**
   * User model
   */
  userModel: UserModel; 

  /**
   * Constructor which initializes the instance of the UserModel
   */
  constructor(){ 
    this.userModel = UserModel.getInstance();
  }

  /**
   * Function which retrieves the UserService instance
   * by creating it if not present
   * 
   * @returns UserService instance
   */
  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Function which creates the user resource record
   * 
   * @param resource 
   * 
   * @returns id of the created resource
   */
  async create(resource: any) : Promise<any>{
    resource.salt = crypto.randomBytes(32).toString('base64');
    const hash = crypto.createHmac('sha512', resource.salt).update(resource.password).digest('base64');
    resource.password = hash + resource.salt;
    const user = new this.userModel.userCollection(resource);
    await user.save();
    return user._id;
  }

  /**
   * Function which deletes a user resource given its id
   * 
   * @param resourceId 
   */
  async deleteById(resourceId: string): Promise<void>{
    await this.userModel.userCollection.deleteOne({_id: resourceId});
  }

  /**
   * Asynchronous function that retrieves all the users in the database
   * 
   * @returns the list of all the users in the database
   */
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

  /**
   * Asynchronous function which updates a user given its id
   * 
   * @param resource 
   * 
   * @returns updated user record
   */
  async updateById(resource: any): Promise<any>{
    if(resource.password){
      resource.salt = crypto.randomBytes(32).toString('base64');
      const hash = crypto.createHmac('sha512', resource.salt).update(resource.password).digest('base64');
      resource.password = hash + resource.salt;
    }
    await this.userModel.userCollection.updateOne({_id: resource.id}, resource);
    return await this.getById(resource.id);
  }

  /**
   * Asynchronous function which retrives a user given its id
   * 
   * @param resourceId 
   * 
   * @returns requested user
   */
  async getById(resourceId: string): Promise<any>{
    const user = await this.userModel.userCollection.findById(resourceId).select(['-password', '-salt', '-__v']);
    return user;
  }

  /**
   * Asynchronous function which retrives a user given its email (which is unique in all the users' collection)
   * 
   * @param resourceId 
   * 
   * @returns requested user
   */
  async getByEmail(email: string): Promise<any>{
    return await this.userModel.userCollection.findOne({email: email});
  }

  /**
   * Asynchronous function which retrieves all the users according to the passed parameters
   * which act as a filter
   * 
   * @param parameters 
   * 
   * @returns users that are compliant with the parameter passed
   */
  async filterList(parameters: any): Promise<any>{
    return await this.userModel.userCollection.find(parameters).select(['-password', '-salt', '-__v']);
  }
}