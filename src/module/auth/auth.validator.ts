import { t } from "elysia";

const AuthValidator = {
  login: t.Object({
    username: t.Optional(t.String({ minLength: 5 })),
    email: t.Optional(
      t.String({
        format: "email",
      })
    ),
    password: t.String({ minLength: 6 }),
  }),
  register: t.Object({
    name: t.String(),
    username: t.String({ minLength: 5 }),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 6 }),
  }),
};

export default AuthValidator;
