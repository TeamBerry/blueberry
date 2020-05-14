import { User } from './user.model';

export interface Session {
    bearer: string,
    subject: AuthSubject,
    expiresIn: number | string
}

export type AuthSubject = Pick<User, '_id' | 'name' | 'mail' | 'settings'>
