import { t } from "elysia";

const UserValidator = {
  readAllUser: t.Object({
    query: t.Optional(t.String()),
  }),
  editAsAdmin: t.Object({
    name: t.Optional(t.String()),
    photo_profile: t.Optional(t.File()),
  }),

  query: t.Object(
    {
      name: t.Optional(t.String()),
      page: t.Number({ error: `insert query 'page' with number inside` }),
      limit: t.Number({ error: `insert query 'limit' with number inside` }),
    },
    { error: "Insert page and limit query, both is number" }
  ),
};

export default UserValidator;
