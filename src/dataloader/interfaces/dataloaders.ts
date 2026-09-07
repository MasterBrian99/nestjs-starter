import DataLoader from 'dataloader';
import { UserObject } from '../../modules/user/dtos/objects/user.object.js';

export interface IDataLoaders {
  userByIdLoader: DataLoader<string, UserObject>;
}
