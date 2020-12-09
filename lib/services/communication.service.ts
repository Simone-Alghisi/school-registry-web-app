import { UserModel } from '../models/user.model';
import { ClassModel } from '../models/class.model';

/**
 * ComunicationService class.
 * It aims to manage all the operations that involve the _communications_ resource
 * by interacting with the database
 */
export class CommunicationService {
  /**
   * CommunicationService instance
   */
  private static instance: CommunicationService;
  /**
   * Class model
   */
  classModel: ClassModel; 
  /**
   * User model
   */
  userModel: UserModel;

  /**
   * Constructor, it obtains the class and user model instance
   */
  constructor(){ 
    this.classModel = ClassModel.getInstance();
    this.userModel = UserModel.getInstance();
  }

  /**
   * Function which retrieves a ComunicationService instance
   */
  static getInstance(): CommunicationService {
    if (!CommunicationService.instance) {
      CommunicationService.instance = new CommunicationService();
    }
    return CommunicationService.instance;
  }

  async create(resource: any) : Promise<any>{
    
  }

  async deleteById(resourceId: string): Promise<void>{
    
  }

  async updateById(resource: any): Promise<any>{

  }

  /**
   * Asynchronous function which retrives a communication sended 
   * to a user given the userId and the resourceId
   * 
   * @param userId the Id of the user 
   * @param resourceId the Id of the communication
   * 
   * @returns requested communication
   */
  async getById(userId: string, resourceId: string): Promise < any > {
    let foundCommunications = await this.userModel.userCollection.findOne({'_id': userId, 'communications._id': resourceId }, {'communications.$._id': resourceId });
    if (foundCommunications) {
      foundCommunications = foundCommunications['communications'][0];
    }
    return foundCommunications;
  }

  /**
   * Asynchronous function which retrives a communication 
   * given its resourceId
   * 
   * @param resourceId the Id of the communication
   * 
   * @returns requested communication
   */
  async getSendedById(resourceId: string): Promise < any > {
    let foundCommunications = await this.userModel.userCollection.findOne({'communications._id': resourceId }, {'communications.$._id': resourceId });
    if (foundCommunications) {
      foundCommunications = foundCommunications['communications'][0];
    }
    return foundCommunications;
  }

  /**
   * Asynchronous function which retrieves all the communication according to the passed parameters
   * which act as a filter
   * 
   * @param parameters 
   * 
   * @returns communication that are compliant with the parameter passed
   */
  async filterList(parameters: any): Promise<any>{
    let filters = this.separateUserCommuicationFields(parameters);
    let userFilters = filters[0];
    let commFilters = filters[1];
    let communicationsRetrieved = await this.userModel.userCollection.find(userFilters).select(['-_id']).select(['communications']);
    let communicationsToReturn:any = [];
    if (communicationsRetrieved) {
      for(let index = 0; index < communicationsRetrieved.length; index++){
        communicationsRetrieved[index] = communicationsRetrieved[index]['communications'];
        if (communicationsRetrieved[index]) {
          let len = communicationsRetrieved[index]['length'];
          let i = 0;
          while (i < len) {
            let keep = true;
            for (const key in commFilters) {
              if (communicationsRetrieved[index][i][key] != commFilters[key]) {
                keep = false;
              }
            }
            if (!keep) {
              communicationsRetrieved[index]['splice'](i, 1);
              len--;
            } else {
              i++;
            }
          }
          communicationsToReturn = communicationsToReturn.concat(communicationsRetrieved[index]);
        }
      }
    }
    return communicationsToReturn;
  }

  /**
   * Function called by {@link filterList} which separates the fields of
   * the UserModel from the one inside the communication fields (also inside
   * UserModel)
   * 
   * @param fields an object of field which are from either UserModel or the communication
   * field insiede of it
   * 
   * @returns an array composed of two objects: fields and commFilters
   */
  separateUserCommuicationFields(fields: any): any{
    const userModel = UserModel.getInstance();
    let commFilters = {};
    try{
      const properties: string[] = Object.keys(userModel.userSchema.paths);
      for(const key of Object.keys(fields)){
        if(properties.indexOf(key) === -1){
          commFilters[key] = fields[key];
          delete fields[key];
        }
      }
    }catch(e){
      throw 'User schema not found';
    }
    return [fields, commFilters];
  }
}