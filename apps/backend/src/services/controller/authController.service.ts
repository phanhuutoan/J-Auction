import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../business/auth.service';
import { UserService } from '../transports/user.service';
import { SigninInputDTO, SignupInputDTO } from 'src/common/DTOs/auths';

@Injectable()
export class AuthControllerService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async signup(signupInput: SignupInputDTO) {
    const user = await this.userService.createUser(signupInput);

    return {
      token: this.authService.generateJwtToken({
        userId: user.id,
        userEmail: user.email,
      }),
      userId: user.id,
    };
  }

  async signin(signinInput: SigninInputDTO) {
    const { email, password } = signinInput;
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new ForbiddenException("The user doesn't exist yet");
    }

    const compareResult = this.authService.comparePassword(
      user.password,
      password,
    );
    if (!compareResult) {
      throw new ForbiddenException('Password is incorrect');
    }

    return this.authService.generateJwtToken({
      userId: user.id,
      userEmail: user.email,
    });
  }
}
