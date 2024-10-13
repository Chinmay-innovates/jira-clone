import { ID, Query } from "node-appwrite";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import {
	DATABASE_ID,
	IMAGES_BUCKET_ID,
	MEMBERS_ID,
	WORKSPACE_ID,
} from "@/config";

import {
	createWorkspaceSchema,
	inviteCodeSchema,
	updateWorkspaceSchema,
} from "../schemas";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode, INVITECODE_LENGTH } from "@/lib/utils";
import { getMember } from "@/features/members/utilts";
import { Workspace } from "../types";

const app = new Hono()
	.get("/", sessionMiddleware, async (c) => {
		const user = c.get("user");
		const databases = c.get("databases");
		const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
			Query.equal("userId", user.$id),
		]);

		if (members.total == 0) {
			return c.json({ data: { documents: [] }, total: 0 });
		}
		const workspaceIds = members.documents.map((member) => member.workspaceId);
		const workspaces = await databases.listDocuments(
			DATABASE_ID,
			WORKSPACE_ID,
			[Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
		);
		return c.json({ data: workspaces });
	})
	.post(
		"/",
		zValidator("form", createWorkspaceSchema),
		sessionMiddleware,
		async (c) => {
			const databases = c.get("databases");
			const storage = c.get("storage");
			const user = c.get("user");

			const { name, image } = c.req.valid("form");
			let uploadedImage: string | undefined;
			if (image instanceof File) {
				const file = await storage.createFile(
					IMAGES_BUCKET_ID,
					ID.unique(),
					image
				);
				const buffer: ArrayBuffer = await storage.getFilePreview(
					IMAGES_BUCKET_ID,
					file.$id
				);
				uploadedImage = `data:image/png;base64,${Buffer.from(buffer).toString(
					"base64"
				)}`;
			}
			const workspace = await databases.createDocument(
				DATABASE_ID,
				WORKSPACE_ID,
				ID.unique(),
				{
					name,
					userId: user.$id,
					imageUrl: uploadedImage,
					inviteCode: generateInviteCode(INVITECODE_LENGTH),
				}
			);

			await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
				userId: user.$id,
				workspaceId: workspace.$id,
				role: MemberRole.ADMIN,
			});
			return c.json({ data: workspace });
		}
	)
	.patch(
		"/:workspaceId",
		sessionMiddleware,
		zValidator("form", updateWorkspaceSchema),
		async (c) => {
			const databases = c.get("databases");
			const storage = c.get("storage");
			const user = c.get("user");

			const { workspaceId } = c.req.param();
			const { name, image } = c.req.valid("form");
			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

			if (!member || member.role !== MemberRole.ADMIN) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			let uploadedImage: string | undefined;
			if (image instanceof File) {
				const file = await storage.createFile(
					IMAGES_BUCKET_ID,
					ID.unique(),
					image
				);
				const buffer: ArrayBuffer = await storage.getFilePreview(
					IMAGES_BUCKET_ID,
					file.$id
				);
				uploadedImage = `data:image/png;base64,${Buffer.from(buffer).toString(
					"base64"
				)}`;
			} else {
				uploadedImage = image;
			}
			const updatedWorkspace = await databases.updateDocument(
				DATABASE_ID,
				WORKSPACE_ID,
				workspaceId,
				{
					name,
					imageUrl: uploadedImage,
				}
			);

			return c.json({ data: updatedWorkspace });
		}
	)
	.delete("/:workspaceId", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { workspaceId } = c.req.param();
		const member = await getMember({
			databases,
			workspaceId,
			userId: user.$id,
		});
		if (!member || member.role !== MemberRole.ADMIN) {
			return c.json({ error: "Unauthorized" }, 401);
		}
		// TODO: delete members, projects, tasks
		await databases.deleteDocument(DATABASE_ID, WORKSPACE_ID, workspaceId);
		return c.json({ data: { $id: workspaceId } });
	})
	.post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { workspaceId } = c.req.param();
		const member = await getMember({
			databases,
			workspaceId,
			userId: user.$id,
		});
		if (!member || member.role !== MemberRole.ADMIN) {
			return c.json({ error: "Unauthorized" }, 401);
		}
		const workspace = await databases.updateDocument(
			DATABASE_ID,
			WORKSPACE_ID,
			workspaceId,
			{
				inviteCode: generateInviteCode(INVITECODE_LENGTH),
			}
		);
		return c.json({ data: workspace });
	})
	.post(
		"/:workspaceId/join",
		sessionMiddleware,
		zValidator("json", inviteCodeSchema),
		async (c) => {
			const { workspaceId } = c.req.param();
			const { code } = c.req.valid("json");

			const databases = c.get("databases");
			const user = c.get("user");

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});
			if (member) {
				return c.json({ error: "Already a membber" }, 400);
			}

			const workspace = await databases.getDocument<Workspace>(
				DATABASE_ID,
				WORKSPACE_ID,
				workspaceId
			);

			if (workspace.inviteCode !== code) {
				return c.json({ error: "Invalid invite code" }, 400);
			}

			await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
				workspaceId,
				userId: user.$id,
				role: MemberRole.MEMBER,
			});
			return c.json({ data: workspace });
		}
	);
export default app;
