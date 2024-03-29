export interface CRUDService {

  /**
   * Retrieves all the documents from the DB
   */
  list: () => any,

  /**
   * Creates a new document on the DB
   */
  create: (resource: any) => any,
  
  /**
   * Updates a document on the DB
   */
  updateById: (resource: any) => any,
  
  /**
   * Retrieves a document by its id from the DB
   */
  getById: (resourceId: string) => any,
  
  /**
   * Removes a document by its id form the DB
   */
  deleteById: (resourceId: string) => any,
  
  /**
   * Filter the document with the query parameters and returns the result
   */
  filterList: (parameters: any) => any
}