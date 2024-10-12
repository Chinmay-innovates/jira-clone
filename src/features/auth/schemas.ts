import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, { message: "Required" }),
});
export const registerSchema = z.object({
	name: z.string().trim().min(1, { message: "Required" }),
	email: z.string().email(),
	password: z.string().min(8, { message: "Minimum of 8 characters required" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;