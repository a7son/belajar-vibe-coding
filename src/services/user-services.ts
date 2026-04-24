import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const registerUser = async (payload: any) => {
    const { name, email, password } = payload;

    // Check if email already exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        throw new Error("Email sudah terdaftar");
    }

    // Hash password
    const hashedPassword = await Bun.password.hash(password);

    // Save user
    await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
    });

    return "OK";
};
