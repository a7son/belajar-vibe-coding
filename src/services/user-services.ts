import { db } from "../db";
import { users, sessions } from "../db/schema";
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

export const loginUser = async (payload: any) => {
    const { email, password } = payload;

    // Find user by email
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!user) {
        throw new Error("Email atau password salah");
    }

    // Verify password
    const isPasswordValid = await Bun.password.verify(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Email atau password salah");
    }

    // Generate token
    const token = crypto.randomUUID();
    const expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() + 1);

    // Save session
    await db.insert(sessions).values({
        userId: user.id,
        token,
        expiredAt,
    });

    return token;
};
