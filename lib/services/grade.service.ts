import { CRUDService } from '../common/interfaces/crudService.interface';
import { ClassModel } from '../models/class.model';

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