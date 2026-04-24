import { Elysia, t } from "elysia";
import { registerUser, loginUser } from "../services/user-services";

export const userRoute = new Elysia({ prefix: "/api/users" })
    .post("/", async ({ body, set }) => {
        try {
            const result = await registerUser(body);
            return {
                message: "User created successfully",
                data: result
            };
        } catch (error: any) {
            set.status = 400;
            return {
                error: error.message
            };
        }
    }, {
        body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String()
        })
    })
    .post("/login", async ({ body, set }) => {
        try {
            const token = await loginUser(body);
            return {
                data: token
            };
        } catch (error: any) {
            set.status = 401;
            return {
                error: error.message
            };
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        })
    });
