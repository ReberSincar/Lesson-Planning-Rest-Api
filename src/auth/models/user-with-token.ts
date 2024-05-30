import { User } from 'src/user/models/user';

export class UserWithToken {
  user: User;
  accessToken: string;
}
