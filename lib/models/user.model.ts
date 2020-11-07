export class User {
    name: string;
    surname: string;
    email: string;
    password: string;
    id: number;
    role: number;
    // TODO change data type to Date after having DB 
    birth_date: string;

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