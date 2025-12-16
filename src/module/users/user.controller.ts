import { status } from "elysia";
import { AuthService } from "../auth/auth.service";
import { UserService } from "./user.service";

export function UserController() {
  return {
    showMe: async ({ AuthRes, store }: any) => {
      const user = await UserService.checkProfile(AuthRes.id);
      store.message = `Your Profile`;
      return {
        user,
        AuthRes,
      };
    },

    showAll: async ({
      query: { name, page, limit },
      store,
    }: {
      query: { name?: string; page: number; limit: number };
      store: any;
    }) => {
      const q = name ?? "";

      const startIndex = (page - 1) * limit;
      const endIndex = limit;

      const profile = await UserService.readAllUser(q, startIndex, endIndex);

      store.message = "Users Read Successfully";
      return {
        user: profile,
      };
    },

    showOne: async ({
      params,
      store,
    }: {
      params: { id: string };
      store: any;
    }) => {
      const profile = await UserService.findById(params.id);

      store.message = "User Read Successfully";
      return {
        user: profile,
      };
    },

    editMe: async ({ AuthRes, store, body }: any) => {
      const { name, photo_profile } = body;

      const buffer = Buffer.from(await photo_profile.arrayBuffer());
      const filename = `${Date.now()}-${photo_profile.name}`;
      const filepath = `./uploads/profile/${filename}`;

      await Bun.write(filepath, buffer);

      const user = await UserService.editProfile(AuthRes.id, {
        name,
        photo_profile: filepath,
      });

      store.message = `Your Profile`;
      return {
        user,
      };
    },

    deleteAccount: async ({ body, AuthRes }: { body: any; AuthRes: any }) => {
      const { username, email, password } = body;
      if (!email && !username && !password)
        throw status(400, "Please Insert Email or Username and Password");
      else if (!email && !username)
        throw status(400, "Please Insert Email or Username");
      else if (!password) throw status(400, "Please Insert Password");

      const accountVerify = await AuthService.findById(AuthRes.id);

      if (email === accountVerify?.email) {
        const pass = await Bun.password.verify(
          password,
          accountVerify?.password!
        );
        if (!pass) {
          throw status(400, "Invalid Email or Password :)");
        }

        const user = await UserService.deleteAccount(AuthRes.id);
        return {
          success: true,
          message: "Successfully Deleted",
          data: {
            user,
          },
        };
      } else {
        throw status(400, "Invalid Email or Password");
      }
    },

    editAsAdmin: async ({
      AuthRes,
      body,
      params,
      store,
    }: {
      AuthRes: any;
      body: { name?: string; photo_profile?: File };
      params: { id: string };
      store: any;
    }) => {
      if (AuthRes.role !== "admin") throw status(401, "Unauthorize");
      const subjectEdit = await AuthService.findById(params.id);
      if (subjectEdit?.role === "admin")
        throw status(401, "Cannot edit other admin account");
      else if (!subjectEdit) throw status(400, "Invalid Id");
      if (!body.name && !body.photo_profile)
        throw status(400, "Insert Somenthing");

      let filepath;

      if (body.photo_profile) {
        const buffer = Buffer.from(await body.photo_profile.arrayBuffer());
        const filename = `${Date.now()}-${body.photo_profile.name}`;
        filepath = `./uploads/profile/${filename}`;

        await Bun.write(filepath, buffer);
      }

      const user = await UserService.editProfile(params.id, {
        ...(body.name ? { name: body.name } : {}),
        ...(body.photo_profile ? { photo_profile: filepath } : {}),
      });

      store.message = `Successfully Edited ${subjectEdit.name}`;

      return {
        user,
      };
    },

    deleteAsAdmin: async ({
      AuthRes,
      params,
      store,
    }: {
      AuthRes: any;
      params: { id: string };
      store: any;
    }) => {
      if (AuthRes.role !== "admin")
        throw status(401, `Unauthorize ${AuthRes.role}`);
      const subjectEdit = await AuthService.findById(params.id);
      if (subjectEdit?.role === "admin")
        throw status(401, "Cannot edit other admin account");
      else if (!subjectEdit) throw status(400, "Invalid Id");

      const user = await UserService.deleteAccount(params.id);

      store.message = `Successfully Deleted ${subjectEdit.name}`;
      return {
        user,
      };
    },
  };
}
