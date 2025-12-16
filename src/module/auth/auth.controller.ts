import { status } from "elysia";
import { AuthService } from "./auth.service";

export function AuthController() {
  return {
    login: async ({ body, store, accJWT, rfJWT, cookie: { refresh } }: any) => {
      const { user, password } = body;

      let usr;

      if (user.includes("@")) {
        usr = await AuthService.findByEmail(user);
      } else {
        usr = await AuthService.findByUsername(user);
      }

      if (!usr) {
        throw status(404, "Invalid Email or Password");
      }

      const pass = await Bun.password.verify(password, usr.password);
      if (!pass) {
        throw status(400, "Invalid Email or Password");
      }

      const access_token = await accJWT.sign({ id: usr.id, role: usr.role });
      const refresh_token = await rfJWT.sign({
        id: usr.id,
        type: "refresh",
      });

      refresh.value = refresh_token;
      refresh.httpOnly = true; // agar tidak bisa dibaca xss
      refresh.secure = false; // ubah ke true jika sudah production, localhost itu bukan https
      refresh.sameSite = "strict";
      refresh.path = "/";
      refresh.maxAge = 60 * 60 * 24 * 14; // 14 hari

      store.message = "Login Successful";

      return {
        user: {
          name: usr.name,
          photo: usr.photo_profile,
          role: usr.role,
        },
        access_token,
      };
    },

    register: async ({
      body,
      accJWT,
      rfJWT,
      cookie: { refresh },
      store,
    }: any) => {
      const { name, username, email, password, photo_profile } = body;

      const isEmailExist = await AuthService.findByEmail(email);
      const isUsernameExist = await AuthService.findByUsername(username);
      if (isEmailExist) throw status(409, "Email already exist");
      else if (isUsernameExist) throw status(409, "Username already taken");

      const hide = await Bun.password.hash(password);

      let filepath;

      if (photo_profile) {
        const buffer = Buffer.from(await photo_profile.arrayBuffer());
        const filename = `${Date.now()}-${photo_profile.name}`;
        filepath = `./uploads/profile/${filename}`;
        await Bun.write(filepath, buffer);
      }

      const user = await AuthService.register({
        name,
        username,
        email,
        password: hide,
        ...(photo_profile ? { photo_profile: `${filepath}` } : {}),
      });

      const access_token = await accJWT.sign({ id: user.id, role: user.role });
      const refresh_token = await rfJWT.sign({
        id: user.id,
        type: "refresh",
      });

      refresh.value = refresh_token;
      refresh.httpOnly = true; // agar tidak bisa dibaca xss
      refresh.secure = false; // ubah ke true jika sudah production, localhost itu bukan https
      refresh.sameSite = "strict";
      refresh.path = "/";
      refresh.maxAge = 60 * 60 * 24 * 14; // 14 hari

      store.message = "Register Successful";

      return {
        user: {
          name: user.name,
          photo: user.photo_profile,
          role: user.role,
        },
        access_token,
      };
    },

    refresh: async ({ accJWT, rfJWT, store, cookie: { refresh } }: any) => {
      const rftoken = refresh.value;
      const payload = await rfJWT.verify(rftoken);
      if (!payload) throw new Error(`invalid refresh token`);

      if (payload.type !== "refresh") {
        throw new Error("invalid token type");
      }

      const user = await AuthService.findById(payload.id);
      if (!user) throw new Error("Account Not Found");

      const access_token = await accJWT.sign({ id: user.id, role: user.role });
      const refresh_token = await rfJWT.sign({
        id: user.id,
        type: "refresh",
      });

      refresh.value = refresh_token;
      refresh.httpOnly = true; // agar tidak bisa dibaca xss
      refresh.secure = false; // ubah ke true jika sudah production, localhost itu bukan https
      refresh.sameSite = "strict";
      refresh.path = "/";
      refresh.maxAge = 60 * 60 * 24 * 14; // 14 hari

      store.message = "Refresh Successful";

      return {
        user: {
          name: user.name,
          photo: user.photo_profile,
          role: user.role,
        },
        access_token,
      };
    },

    logout: async ({ cookie: { refresh }, store }: any) => {
      if (!refresh.value) throw status(404, "You are not logged in");
      refresh.remove();
      store.message = "Logout Successful";
    },
  };
}
