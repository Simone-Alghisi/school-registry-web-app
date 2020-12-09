import { UserModel } from '../models/user.model';

/**
 * YourselfService class.
 * It aims to manage all the operations that involve the _yourself_ resource
 * by interacting with the database
 */
export class YourselfService {
  /**
   * YourselfService instance
   */
  private static instance: YourselfService;
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
   * Function which retrieves the YourselfService instance
   * by creating it if not present
   * 
   * @returns YourselfService instance
   */
  static getInstance(): YourselfService {
    if (!YourselfService.instance) {
      YourselfService.instance = new YourselfService();
    }
    return YourselfService.instance;
  }

  /**
   * Functions that returns the user with the specified id and selects only
   * his/hers email, _id, role, teaches, class_id
   * 
   * @param userId Id of the user asking for the resource
   * @param role role of the user asking for the resource
   */
  async get(userId: string, role: number): Promise<any>{
    let yourself = null;

    switch(role){
      case 0: //student
        yourself = await this.userModel.userCollection.findById(userId).select(['email', '_id', 'role', 'class_id']);
        break;
      case 1: //professor
        yourself = await this.userModel.userCollection.findById(userId).select(['email', '_id', 'role', 'teaches']);
        break;
      case 2: //secretary
        yourself = await this.userModel.userCollection.findById(userId).select(['email', '_id', 'role']);
        break;
    }

    return yourself;
  }
}