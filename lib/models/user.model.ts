/**
 * Model for the instances of the resource _/users_
 */
export class User {
    /**name of the user */
    name: string;
    /**last name of the user */
    surname: string;
    /**email of the user */
    email: string;
    /**password of the account */
    password: string;
    /**unique identifier of the user */
    id: number;
    /**number specifying if the user is a _student_, a _teacher_ or a _secretary_ */
    role: number;
    // TODO change data type to Date after having DB 
    /**date of birth */
    birth_date: string;

    /**
     * 
     * @param name name of the user
     * @param surname last name of the user
     * @param email email of the user
     * @param password password of the account
     * @param id unique identifier of the user
     * @param role number specifying if the user is a _student_, a _teacher_ or a _secretary_
     * @param birth_date date of birth
     */
    constructor(name: string, surname: string, email: string, password: string, id: number, role: number, birth_date: string){
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.id = id;
        this.role = role;
        this.birth_date = birth_date;
    }
}