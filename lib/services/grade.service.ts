import { ClassModel } from '../models/class.model';
import mongoose from 'mongoose';

/**
 * GradeService class
 * It aims to manage all the operations that involve the _classes/{id}/grades_ resource
 * by interacting with the database
 */
export class GradeService {
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
    await this.classModel.classCollection.updateOne({
      _id: resource.class_id,
    }, {
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
    });
    return [resource.class_id, newDocumentId];
  }

  /**
   * Deletes a grade from a class in the db
   * @param resource request parameters containing the class id _id_ and the grade id _idg_
   */
  async deleteById(resource: any): Promise < void > {
    await this.classModel.classCollection.updateOne({
      _id: resource.id
    },{
      $pull: {
        grades_list: {
          _id: resource.idg
        }
      }      
    });
  }

  /**
   * Gets list of grades of a class from db
   * @param classId id of the class
   */
  async list(classId: any): Promise < any > {
    let foundGrades = await this.classModel.classCollection.findById(classId).select(['-_id']).select(['grades_list']);
    if (foundGrades) {
      foundGrades = foundGrades['grades_list'];
    }
    return foundGrades;
  }

  /**
   * Asynchronous function which update a grade resource
   * @param resource resourse to update
   * 
   * @returns class id, in which the student is enrolled
   * @returns updated grade to return 
   */
  async updateById(resource: any): Promise < any > {
    await this.classModel.classCollection.updateOne({'_id': resource.class_id, 'grades_list._id': resource.grade_id}, {'$set': resource['$set']});
    return await this.getById(resource.class_id, resource.grade_id);
  }

  /**
   * Gets a specific grade given its id and the class id from the db
   * @param classId id of the class containing the grade
   * @param resourceId id of the grade
   */
  async getById(classId: any, resourceId: string): Promise < any > {
    let foundGrades = await this.classModel.classCollection.findOne({'_id': classId, 'grades_list._id': resourceId}, {'grades_list.$._id': resourceId});
    if (foundGrades) {
      foundGrades = foundGrades['grades_list'][0];
    }
    return foundGrades;
  }

  /**
   * Gets list of grades of a class from db respecting parameters
   * @param classId id of the class
   * @param parameters query parameters
   */
  async filterList(classId: any, parameters: any): Promise < any > {
    let foundGrades = await this.classModel.classCollection.findById(classId).select(['-_id']).select(['grades_list']);
    if (foundGrades) {
      foundGrades = foundGrades['grades_list'];

      if (foundGrades) {
        //apply filters
        let len = foundGrades['length'];
        let i = 0;
        while (i < len) {
          let keep = true;
          for (const key in parameters) {
            if (foundGrades[i][key] != parameters[key]) {
              keep = false;
            }
          }
          if (!keep) {
            foundGrades['splice'](i, 1);
            len--;
          } else {
            i++;
          }
        }
      }
    }

    return foundGrades;
  }
}