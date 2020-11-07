import express, { Application } from 'express';

export class CommonRoutes {
  app: Application;
  name: string;

  constructor(app: Application, name: string) {
    this.app = app;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}