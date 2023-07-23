import { AuthService } from "./authService";
import { BidService } from "./bidService";
import { registerService } from "./serviceSingleton";
import { UserService } from "./userService";

export function initService() {
  console.log("Registering Service...");
  registerService(AuthService);
  registerService(UserService);
  registerService(BidService);
}
