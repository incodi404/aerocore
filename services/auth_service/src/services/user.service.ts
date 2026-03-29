import { User } from "../types/user.type";

class CustomerAuth {
  // register user
  async create(): Promise<User> {
    return {
      email: "",
      id: "",
      name: "",
      userId: "",
    };
  }
}
