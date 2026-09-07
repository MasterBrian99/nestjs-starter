import { User } from '../database/schema/users.js';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
