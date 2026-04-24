import { Elysia, t } from "elysia";
import { registerUser } from "../services/user-services";

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
    });
