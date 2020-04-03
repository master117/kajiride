export interface User {
    id: number,
    name: string;
    role: Role;
    token: string;
}

export enum Role {
    user = 0,
    admin = 1,
}