import { ClassModel } from '../models/class.model';
import mongoose from 'mongoose';

/**
 * Semplicemente la classe intermedia che interagisce con il model
 */
export class GradeService /*implements CRUDService*/ {
  private static instance: GradeService;
  classModel: ClassModel; 

  constructor(){ 
    this.classModel = ClassModel.getInstance();
  }

  static getInstance(): GradeService {
    if (!GradeService.instance) {
      GradeService.instance = new GradeService();
    }
    return GradeService.instance;
  }

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