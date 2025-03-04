import type { UserService } from "./user.service";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async getUserById(userId: string) {
    return this.userService.findUserById(userId);
  }
}
