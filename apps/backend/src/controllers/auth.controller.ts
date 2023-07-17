import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { SigninInputDTO, SignupInputDTO } from 'src/common/DTOs/auths';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import {
  signinValidationSchema,
  signupValidationSchema,
} from 'src/common/validation/auth.schema';
import { AuthControllerService } from 'src/services/controller/authController.service';

@Controller('/auth')
export class AuthController {
  constructor(private authControllerService: AuthControllerService) {}

  @Post('/signup')
  @UsePipes(new JoiValidationPipe(signupValidationSchema))
  async signUp(@Body() signupInput: SignupInputDTO) {
    const userData = await this.authControllerService.signup(signupInput);

    return userData;
  }

  @Post('/signIn')
  @UsePipes(new JoiValidationPipe(signinValidationSchema))
  async signIn(@Body() signinInput: SigninInputDTO) {
    const token = await this.authControllerService.signin(signinInput);

    return {
      token,
    };
  }
}
