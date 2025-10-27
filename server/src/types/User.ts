export interface User {
    firstName: string;
    username: string;
    email: string;
    password: string;
}

export interface UserLogin extends User {
    address: string;
    
}