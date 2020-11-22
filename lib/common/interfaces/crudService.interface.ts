export interface CRUDService {

  list: () => any,

  create: (resource: any) => any,
  
  updateById: (resource: any) => any,
  
  getById: (resourceId: string) => any,
  
  deleteById: (resourceId: string) => any,

  filterList: (parameters: any) => any
}