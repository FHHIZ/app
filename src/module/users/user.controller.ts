import { status } from "elysia";
import { AuthService } from "../auth/auth.service";
import { UserService } from "./user.service";

export function UserController() {
  return {
    showMe: async ({ accJWT, request: { headers } }: any) => {
      const auth = headers.get("authorization");
      const [scheme, token] = auth.split(" ");
      if (scheme === "Bearer") {
        const payload = await accJWT.verify(token);
        const profile = await UserService.checkProfile(payload.id);
        return {
          success: true,
          message: `Your Profile`,
          data: profile,
        };
      } else {
        throw new Error("Oh uh, Somenthing is Wrong");
      }
    },

    showAll: async ({ query }: { query?: Record<string, string> }) => {
      const q = query?.q ?? "";
      const profile = await UserService.readAllUser(q);

      return {
        status: 200,
        message: "Users Read Successfully",
        data: profile,
      };
    },

    showOne: async ({ params }: { params: { id: string } }) => {
      const profile = await UserService.findById(params.id);

      return {
        status: 200,
        message: "User Read Successfully",
        data: profile,
      };
    },

    editMe: async ({ accJWT, request: { headers }, body }: any) => {
      const { name, photo_profile } = body;

      const auth = headers.get("authorization");
      const [scheme, token] = auth.split(" ");
      if (scheme === "Bearer") {
        const payload = await accJWT.verify(token);

        const buffer = Buffer.from(await photo_profile.arrayBuffer());
        const filename = `${Date.now()}-${photo_profile.name}`;
        const filepath = `./uploads/${filename}`;

        await Bun.write(filepath, buffer);

        const data = await UserService.editProfile(payload.id, {
          name,
          photo_profile: `/upload/${filename}`,
        });

        return {
          success: true,
          message: `Your Profile`,
          data,
        };
      } else {
        throw new Error("Oh uh, Somenthing is Wrong");
      }
    },

    deleteAccount: async ({
      body,
      params,
    }: {
      body: any;
      params: { id: string };
    }) => {
      const { username, email, password } = body;
      if (!email && !username && !password)
        return "Please Insert Email or Username and Password";
      else if (!email && !username) return "Please Insert Email or Username";
      else if (!password) return "Please Insert Password";

      const accountVerify = await AuthService.findById(params.id);

      if (
        email === accountVerify?.email ||
        username === accountVerify?.username
      ) {
        const pass = await Bun.password.verify(
          password,
          accountVerify?.password!
        );
        if (!pass) {
          return status(400, { error: "Invalid Email or Password" });
        }

        const user = await UserService.deleteAccount(params.id);
        return {
          success: true,
          message: "Successfully Deleted",
          data: {
            user,
          },
        };
      } else {
        return status(400, { error: "Invalid Email or Password" });
      }
    },
  };
}
