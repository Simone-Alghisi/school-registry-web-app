import {
  ClassModel
} from '../models/class.model';
import mongoose from 'mongoose';

/**
 * Semplicemente la classe intermedia che interagisce con il model
 */
export class GradeService /*implements CRUDService*/ {
  private static instance: GradeService;
  classModel: ClassModel;

  constructor() {
    this.classModel = ClassModel.getInstance();
  }

  static getInstance(): GradeService {
    if (!GradeService.instance) {
      GradeService.instance = new GradeService();
    }
    return GradeService.instance;
  }

  async create(resource: any): Promise < any > {
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

  async deleteById(resourceId: string): Promise < void > {

  }

  /**
   * Gets list of grades of a class from db
   * @param classId id of the class
   */
  async list(classId: any): Promise < any > {
    const foundGrades = await this.classModel.classCollection.findById(classId).select(['-_id']).select(['grades_list']);
    return foundGrades;
  }

  async updateById(resource: any): Promise < any > {

  }

  async getById(resourceId: string): Promise < any > {

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
        //applico filtri
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