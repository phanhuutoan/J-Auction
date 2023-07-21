import { User } from "../models/model";
import { BaseService } from "./BaseService";

export class UserService extends BaseService {
  getUserData() {
    return this.axiosRequest().get<User>("/user");
  }
}
