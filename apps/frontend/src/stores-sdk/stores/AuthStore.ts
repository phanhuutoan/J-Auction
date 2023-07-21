import { makeAutoObservable } from "mobx";
import { AuthService } from "../services/authService";
import { getService } from "../services/serviceSingleton";
import type { SigninDTO, SignupDTO } from "../models/DTOs";
import { STORAGE_KEY_TOKEN } from "../models/constant";

export class AuthStore {
  private authService!: AuthService;

  token?: string;

  constructor() {
    this.authService = getService(AuthService);

    makeAutoObservable(this);
  }

  async signin(signinPayload: SigninDTO) {
    const data = await this.authService.sendSigninRequest(signinPayload);

    if (data) {
      this.token = data.token;
      this.saveToCache(data.token);
    }
  }

  async signup(signupPayload: SignupDTO) {
    const data = await this.authService.sendSignupRequest(signupPayload);

    if (data) {
      this.token = data.token;
      this.saveToCache(data.token);
    }
  }

  autoSignin() {
    const existingToken = this.restoreCache();

    if (existingToken) {
      this.token = existingToken;
    }
  }

  logout() {
    this.token = undefined;
    this.clearCache();
  }

  private saveToCache(token: string) {
    sessionStorage.setItem(STORAGE_KEY_TOKEN, token);
  }

  private restoreCache() {
    return sessionStorage.getItem(STORAGE_KEY_TOKEN);
  }

  private clearCache() {
    return sessionStorage.removeItem(STORAGE_KEY_TOKEN);
  }
}
