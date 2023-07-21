import { AxiosResponse } from "axios";
import { BaseService } from "./BaseService";
import { AuthResponseDTO, SigninDTO, SignupDTO } from "../models/DTOs";

export class AuthService extends BaseService {
  async sendSigninRequest(signinPayload: SigninDTO) {
    const { email, password } = signinPayload;
    const res = await this.axiosRequest().post<
      SigninDTO,
      AxiosResponse<AuthResponseDTO>
    >("/auth/signin", { email, password });

    return res?.data;
  }

  async sendSignupRequest(signupPayload: SignupDTO) {
    const { email, password, userName } = signupPayload;
    const res = await this.axiosRequest().post<
      SignupDTO,
      AxiosResponse<AuthResponseDTO>
    >("/auth/signup", { email, password, userName });

    return res?.data;
  }
}
