import type { User } from "../models/model";
import { UserService } from "../services/userService";
import { getService } from "../services/serviceSingleton";
import { makeAutoObservable } from "mobx";

export class UserStore {
  currentUser?: User;

  private userService: UserService;

  constructor() {
    this.userService = getService(UserService);

    makeAutoObservable(this);
  }

  async getCurrentUserData() {
    const resp = await this.userService.getUserData();

    if (resp) {
      this.currentUser = resp.data;
    }
  }
}
