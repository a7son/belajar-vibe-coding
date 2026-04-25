import { Elysia, t } from "elysia";
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../services/user-services";

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
            name: t.String({ maxLength: 255 }),
            email: t.String({ maxLength: 255 }),
            password: t.String({ maxLength: 255 })
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
    })
    .guard({
        beforeHandle({ headers, set }) {
            const auth = headers['authorization'];
            if (!auth || !auth.startsWith("Bearer ")) {
                set.status = 401;
                return { error: "Unauthorized" };
            }
        }
    })
    .derive(({ headers }) => ({
        token: headers['authorization']!.split(" ")[1]
    }))
    .get("/current", async ({ token, set }) => {
        try {
            const user = await getCurrentUser(token);
            return {
                data: user
            };
        } catch (error: any) {
            set.status = 401;
            return {
                error: "Unauthorized"
            };
        }
    })
    .delete("/logout", async ({ token, set }) => {
        try {
            await logoutUser(token);
            return {
                data: "OK"
            };
        } catch (error: any) {
            set.status = 401;
            return {
                error: "Unauthorized"
            };
        }
    });
