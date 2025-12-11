import cookie from "@elysiajs/cookie";
import { AuthService } from "./auth.service";

export function AuthController() {
  return {
    login: async ({
      body,
      status,
      accJWT,
      rfJWT,
      cookie: { refresh },
    }: any) => {
      const { username, email, password } = body;
      if (!email && !username && !password)
        return "Please Insert Email or Username and Password";
      else if (!email && !username) return "Please Insert Email or Username";
      else if (!password) return "Please Insert Password";

      const user = await (email
        ? AuthService.findByEmail(email)
        : AuthService.findByUsername(username));
      if (!user) {
        return status(404, { error: "Account not Found" });
      }

      const pass = await Bun.password.verify(password, user.password);
      if (!pass) {
        return status(400, { error: "Password is Incorrect" });
      }

      const access_token = await accJWT.sign({ id: user.id });
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

      return {
        success: true,
        message: `Login Success. Welcome, ${user.name}`,
        data: {
          access_token,
          photo: user.photo_profile,
          name: user.name,
          role: user.role,
        },
      };
    },

    register: async ({ body, accJWT, rfJWT, cookie: { refresh } }: any) => {
      const { name, username, email, password } = body;

      const isEmailExist = await AuthService.findByEmail(email);
      const isUsernameExist = await AuthService.findByUsername(username);
      if (isEmailExist) return { error: "User already exist" };
      else if (isUsernameExist) return { error: "Username was already taken" };

      const hide = await Bun.password.hash(password);
      const user = await AuthService.register({
        name,
        username,
        email,
        password: hide,
      });

      const access_token = await accJWT.sign({ id: user.id });
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

      return {
        success: true,
        message: `Register Success. Welcome, ${user.name}`,
        data: {
          access_token,
          photo: user.photo_profile,
          name: user.name,
          role: user.role,
        },
      };
    },

    refresh: async ({ accJWT, rfJWT, cookie: { refresh } }: any) => {
      const rftoken = refresh.value;
      const payload = await rfJWT.verify(rftoken);
      if (!payload) throw new Error(`invalid refresh token`);

      if (payload.type !== "refresh") {
        throw new Error("invalid token type");
      }

      const user = await AuthService.findById(payload.id);
      if (!user) throw new Error("Account Not Found");

      const access_token = await accJWT.sign({ id: user.id });
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

      return {
        success: true,
        message: `Refresh Token Success, Welcome Back, ${user.name}`,
        data: {
          access_token,
          photo: user.photo_profile,
          name: user.name,
          role: user.role,
        },
      };
    },

    logout: async ({ cookie: { refresh } }: any) => {
      refresh.remove();
    },
  };
}
