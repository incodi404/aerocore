import * as userSchema from "./user.schema";
import * as adminSchema from "./admin.schema";

const schema = {
  ...userSchema,
  ...adminSchema,
};

export default schema;
