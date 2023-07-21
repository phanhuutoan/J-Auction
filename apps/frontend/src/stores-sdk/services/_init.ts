import { AuthService } from "./authService";
import { registerService } from "./serviceSingleton";
import { UserService } from "./userService";

export function initService() {
  console.log("Registering Service...");
  registerService(AuthService);
  registerService(UserService);
}
