import { t, validationDetail } from "elysia";

const AuthValidator = {
  login: t.Object({
    user: t.String({
      minLength: 5,
      error: "Email or Username cannot be empty",
    }),
    password: t.String({ minLength: 6, error: "Password cannot be empty" }),
  }),

  register: t.Object(
    {
      name: t.String({ error: "Name cannot be empty" }),
      username: t.String({ minLength: 5, error: "username cannot be empty" }),
      email: t.String({ format: "email", error: "email cannot be empty" }),
      password: t.String({ minLength: 6, error: "password cannot be empty" }),
      photo_profile: t.Optional(t.File({ error: "invalid photo profile" })),
    },
    { error: `Insert name, username, email, password, photo_profile` }
  ),
};

export default AuthValidator;
