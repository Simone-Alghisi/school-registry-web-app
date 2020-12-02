import { ClassModel } from '../models/class.model';
import mongoose from 'mongoose';

/**
 * GradeService class
 * It aims to manage perform all the operations that involve the _classes/{id}/grades_ resource
 * by interacting with the database
 */
export class GradeService /*implements CRUDService*/ {
  /**
   * GradeService instance
   */
  private static instance: GradeService;
  /**
   * Class model 
   */
  classModel: ClassModel; 

  /**
   * Constructor which initialize the class model instance
   */
  constructor(){ 
    this.classModel = ClassModel.getInstance();
  }

  /**
   * Function which retrieves the GradeService instance
   * by creating it if not present
   * 
   * @returns GradeService instance
   */
  static getInstance(): GradeService {
    if (!GradeService.instance) {
      GradeService.instance = new GradeService();
    }
    return GradeService.instance;
  }

  /**
   * Asynchronous function which creates a grade resource given all the required parameter
   * @param resource 
   * 
   * @returns class id, in which the student is enrolled
   * @returns grade id, which correspond to the one just created by the function
   */
  async create(resource: any) : Promise<any>{
    const newDocumentId = new mongoose.Types.ObjectId();
    await this.classModel.classCollection.updateOne(
      { 
        _id: resource.class_id,
      }, 
      {
        $push: {
          grades_list: { 
            _id: newDocumentId,
            value: resource.value, 
            date: resource.date, 
            subject: resource.subject,
            student_id: resource.student_id,
            description: resource.description 
          }
        }
      }
    );
    return [resource.class_id, newDocumentId];
  }

  async deleteById(resourceId: string): Promise<void>{

  }

  /**
   * Asynchronous function which retrieves all the grades associate with a class
   * 
   * @param classId 
   * 
   * @return a list of grades associated with the given classId
   */
  async list(classId: any): Promise<any>{
    const foundGrades = await this.classModel.classCollection.findById(classId).select(['-_id']).select(['grades_list']);
    return foundGrades;
  }

  async updateById(resource: any): Promise<any>{
    
  }

  async getById(resourceId: string): Promise<any>{
    
  }

  async filterList(parameters: any): Promise<any>{
    
  }
}