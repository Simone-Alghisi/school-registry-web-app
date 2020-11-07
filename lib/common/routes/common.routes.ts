import express, { Application } from 'express';

/**
 * Base class for all Routes. Contains common attributes and methods.
 */
export class CommonRoutes {
  /**Express instance */
  app: Application;
  /** Name of the route */
  name: string;

  /**
   * @param app Express instance
   * @param name Name of the route
   */
  constructor(app: Application, name: string) {
    this.app = app;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}