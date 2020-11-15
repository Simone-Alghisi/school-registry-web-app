import mongoose from 'mongoose';
import dotenv from 'dotenv';

export class MongooseService {
  private static instance: MongooseService;
  private uri: string;
  /**
   * Vedere cosa sono le options qui
   */
  options = {
    autoIndex: true,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  };
  count = 0;

  constructor() {
    dotenv.config();
    this.uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : '';
    this.connect();
  }

  public static getInstance(): MongooseService{
    if (!this.instance) {
      this.instance = new MongooseService();
    }
    return this.instance;
  }

  getMongoose(){
    return mongoose;
  }

  connect(): void{
    if(mongoose.connection.readyState === 0){
      console.log('MongoDB connection');
      mongoose.connect(this.uri, this.options).then(() => {  //Meglio con dei json con i config
        console.log('MongoDB is connected');
      }).catch( error => {
        console.log('Failed connection');
        console.log( error.stack );
      });
    }else{
      console.log('Alreay connected!');
    }
  }

  isValidId(id: string) : boolean{
    return mongoose.Types.ObjectId.isValid(id);
  }
}