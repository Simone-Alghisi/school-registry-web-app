import { CRUDService } from '../common/interfaces/crudService.interface';
import { UserModel } from '../models/user.model';
import { ClassModel } from '../models/class.model';

/**
 * ComunicationService class, it implements the {@link CRUDService} interface.
 * It aims to manage perform all the operations that involve the _class_ resource
 * by interacting with the database
 */
export class CommunicationService /*implements CRUDService*/ {
  /**
   * CommunicationService instance
   */
  private static instance: CommunicationService;
  /**
   * Class model
   */
  classModel: ClassModel; 
  /**
   * Class model
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

  //Not used 
  async list(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.userModel.userCollection.find().select(['communications'])
        .exec(function (err, classes) {
        if (err) {
            reject(err);
        } else {
            resolve(classes);
        }
        })
    });
  }

  async updateById(resource: any): Promise<any>{

  }

  async getById(userId: string, resourceId: string): Promise < any > {
    console.log("UserId: " + userId + " resourceId: " + resourceId);
    let foundCommunications = await this.userModel.userCollection.findOne({'_id': userId, 'communications._id': resourceId }, {'communications.$._id': resourceId });
    if (foundCommunications) {
      foundCommunications = foundCommunications['communications'][0];
    } else {
      console.log('Non trovo per id');
    }
    return foundCommunications;
  }

  async getSendedById(resourceId: string): Promise < any > {
    let foundCommunications = await this.userModel.userCollection.findOne({'communications._id': resourceId }, {'communications.$._id': resourceId });
    if (foundCommunications) {
      foundCommunications = foundCommunications['communications'][0];
    } else {
      console.log('Non trovo per id');
    }
    return foundCommunications;
  }

  async filterList(parameters: any): Promise<any>{
    console.log(parameters);
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