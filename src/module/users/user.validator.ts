import { t } from "elysia";

const UserValidator = {
  readAllUser: t.Object({
    query: t.Optional(t.String()),
  }),
};

export default UserValidator;
