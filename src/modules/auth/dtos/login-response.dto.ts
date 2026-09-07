import { UserDto } from '../../user/dtos/user.dto.js';

export class LoginResponseDto {
  /**
   * Access Token for user
   *
   * @example abc123......
   * @type {string}
   * @memberof LoginResponseDto
   */
  accessToken!: string;

  /**
   * User
   *
   * @type {UserDto}
   * @memberof LoginResponseDto
   */
  user!: UserDto;
}
