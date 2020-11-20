import { CRUDService } from '../common/interfaces/crudService.interface';
import { ClassModel } from '../models/class.model';

/**
 * Semplicemente la classe intermedia che interagisce con il model
 */
export class ClassService implements CRUDService {
  private static instance: ClassService;
  classModel: ClassModel; 

  constructor(){ 
    this.classModel = ClassModel.getInstance();
  }

  static getInstance(): ClassService {
    if (!ClassService.instance) {
      ClassService.instance = new ClassService();
    }
    return ClassService.instance;
  }

  async create(resource: any) : Promise<any>{
    const newClass = new this.classModel.classCollection(resource);
    await newClass.save();
    return newClass._id;
  }

  async deleteById(resourceId: string): Promise<void>{}

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

  async updateById(resource: any): Promise<any>{}

  async getById(resourceId: string): Promise<any>{}

  async getByEmail(email: string): Promise<any>{}
}