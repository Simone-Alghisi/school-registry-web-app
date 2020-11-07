import { use } from 'chai';
import { User } from '../models/user.model'
import jsonUserData from './data/user.json'; 

const users: User[] = Object.assign(new Array<User>(), jsonUserData); 
//console.log(typeof users);
//console.log(users[0].name);

export default users;