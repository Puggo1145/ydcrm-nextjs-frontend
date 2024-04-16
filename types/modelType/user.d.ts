export type role = 'super_admin' | 'admin' | 'employee' | 'partime_employee';
export type Account = Omit<User, "password" | "createdAt" | "updatedAt">

export interface User {
    _id: string;
    role: role;
    name: string;
    phone: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}