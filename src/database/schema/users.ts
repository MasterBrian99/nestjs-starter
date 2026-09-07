import { CreatedAt, UpdatedAt } from './common/datetime.js';
import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface UserTable {
  id: Generated<string>;
  name: string | null;
  email: string;
  passwordHash: string;
  verified: Generated<boolean>;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}

export type User = Selectable<UserTable>;
export type UserCreate = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
