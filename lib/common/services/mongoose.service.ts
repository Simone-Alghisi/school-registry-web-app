import mongoose from 'mongoose';
import dotenv from 'dotenv';

/**
 * MongooseService class
 * It implements the connection to the MongoDB database
 */
export class MongooseService {
  /**
   * Instance of the mongoose service
   */
  private static instance: MongooseService;
  /**
   * Db connection uri
   */
  private uri: string;

  /**
   * Database options
   */
  options = {
    autoIndex: true,            //Mongoose will automatically build indexes
    poolSize: 10,               //Maximum number of sockets that need to be kept open
    bufferMaxEntries: 0,        //Disabling MongoDB buffering mechanism, errors should be thrown when the driver is not connected
    useNewUrlParser: true,      //Use new connection string parser
    useUnifiedTopology: true,   //Set the new MongoDB connection management engine
    useCreateIndex: true        //Set createIndex() as Mongoose's default index method for creating index
  };

  /**
   * Mongoose service constructor, 
   * It connects the application to the database, if possible
   */
  constructor() {
    dotenv.config();
    this.uri = process.env.MONGODB_URI || '';
    this.connect();
  }

  /**
   * Obtains the MongooseService service instance
   * 
   * @returns MongooseService instance
   */
  public static getInstance(): MongooseService{
    if (!this.instance) {
      this.instance = new MongooseService();
    }
    return this.instance;
  }

  /**
   * Return the mongoose module
   */
  getMongoose(){
    return mongoose;
  }

  /**
   * Connect to the database only if there's no other instance connected
   */
  connect(): void{
    if(mongoose.connection.readyState === 0){
      console.log('MongoDB connection');
      mongoose.connect(this.uri, this.options).then(() => {
        console.log('MongoDB is connected');
      }).catch( error => {
        console.log('Failed connection');
        console.log( error.stack );
      });
    }else{
      console.log('Already connected!');
    }
  }

  /**
   * Function that checks if the mongoose.Types.ObjectId is a valid one
   * @param id 
   * 
   * @returns true if the ObjectId is valid
   * @returns false if it is not valid
   */
  isValidId(id: string) : boolean{
    return mongoose.Types.ObjectId.isValid(id);
  }
}