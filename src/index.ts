import { Elysia } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";
import { userRoute } from "./routes/user-route";

export const app = new Elysia()
  .get("/", () => "Hello World from Elysia!")
  .get("/users", async () => {
    try {
      return await db.select().from(users);
    } catch (error) {
      return { error: "Could not fetch users", details: (error as Error).message };
    }
  })
  .use(userRoute);

app.listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
