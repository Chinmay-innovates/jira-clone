import { z } from "zod";

export const createWorkspaceSchema = z.object({
	name: z.string().trim().min(1, { message: "Required" }),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
