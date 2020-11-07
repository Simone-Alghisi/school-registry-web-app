/**
 * Interface that all Routes have to implement.
 * Exposes the configureRoutes() method
 */
export interface ConfigureRoutes {
  /**
   * Implementations will create all the routes for the specific resource
   */
  configureRoutes: () => void;
}