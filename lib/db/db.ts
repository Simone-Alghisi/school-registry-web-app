import { use } from 'chai';
import { User } from '../models/user.model'
import jsonUserData from './data/user.json'; 

/**Array of instances of all users */
const users: User[] = Object.assign(new Array<User>(), jsonUserData);

export default users;