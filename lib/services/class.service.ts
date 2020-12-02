import { CRUDService } from '../common/interfaces/crudService.interface';
import { ClassModel } from '../models/class.model';

/**
 * ClassService class, it implements the {@link CRUDService} interface.
 * It aims to manage perform all the operations that involve the _class_ resource
 * by interacting with the database
 */
export class ClassService implements CRUDService {
  /**
   * ClassService instance
   */
  private static instance: ClassService;
  /**
   * Class model
   */
  classModel: ClassModel; 

  /**
   * Constructor, it obtains the class model instance
   */
  constructor(){ 
    this.classModel = ClassModel.getInstance();
  }

  /**
   * Function which retrieves a ClassService instance
   */
  static getInstance(): ClassService {
    if (!ClassService.instance) {
      ClassService.instance = new ClassService();
    }
    return ClassService.instance;
  }

  /**
   * Function which creates the class resource record
   * 
   * @param resource 
   * 
   * @returns id of the created resource
   */
  async create(resource: any) : Promise<any>{
    const newClass = new this.classModel.classCollection(resource);
    await newClass.save();
    return newClass._id;
  }

  /**
   * Function which deletes a class resource given its id
   * 
   * @param resourceId 
   */
  async deleteById(resourceId: string): Promise<void>{
    await this.classModel.classCollection.deleteOne({_id: resourceId});
  }

  /**
   * Asynchronous function that retrieves all the classes in the database
   * 
   * @returns the list of all the classes in the database
   */
  async list(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.classModel.classCollection.find().select(['-__v'])
        .exec(function (err, classes) {
        if (err) {
            reject(err);
        } else {
            resolve(classes);
        }
        })
    });
  }

  /**
   * Asynchronous function which updates a class given its id
   * 
   * @param resource 
   * 
   * @returns updated class record
   */
  async updateById(resource: any): Promise<any>{
    await this.classModel.classCollection.updateOne({_id: resource.id}, resource);
    return await this.getById(resource.id);
  }

  /**
   * Asynchronous function which retrives a class given its id
   * 
   * @param resourceId 
   * 
   * @returns requested class
   */
  async getById(resourceId: string): Promise<any>{
    const foundClass = await this.classModel.classCollection.findById(resourceId).select(['-__v']);
    return foundClass;
  }

  /**
   * Asynchronous function which retrieves all the classes according to the passed parameters
   * which act as a filter
   * 
   * @param parameters 
   * 
   * @returns classes that are compliant with the parameter passed
   */
  async filterList(parameters: any): Promise<any>{
    return await this.classModel.classCollection.find(parameters);
  }
}