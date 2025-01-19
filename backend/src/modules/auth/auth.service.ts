import type { RegisterDto } from "../common/interface/auth.interface";

export class AuthService {
  public async register(registerData: RegisterDto) {
    const { name, email, password, confirmPassword } = registerData;
    console.log({ name, email, password, confirmPassword });
    //const existingUser = await UserModel
  }
}
