import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";

import { getMember } from "@/features/members/utilts";
import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";

import { createProjectSchema, updateProjectSchema } from "../schemas";
import { Project } from "../types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
	.post(
		"/",
		sessionMiddleware,
		zValidator("form", createProjectSchema),
		async (c) => {
			const databases = c.get("databases");
			const storage = c.get("storage");
			const user = c.get("user");

			const { name, image, workspaceId } = c.req.valid("form");

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

			if (!member) {
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
			}

			const project = await databases.createDocument(
				DATABASE_ID,
				PROJECTS_ID,
				ID.unique(),
				{
					name,
					imageUrl: uploadedImage,
					workspaceId,
				}
			);
			return c.json({ data: project });
		}
	)
	.get(
		"/",
		sessionMiddleware,
		zValidator("query", z.object({ workspaceId: z.string() })),
		async (c) => {
			const user = c.get("user");
			const databases = c.get("databases");

			const { workspaceId } = c.req.valid("query");
			if (!workspaceId) {
				return c.json({ error: "Missing workspaceId" }, 400);
			}

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

			if (!member) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const projects = await databases.listDocuments<Project>(
				DATABASE_ID,
				PROJECTS_ID,
				[Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
			);

			return c.json({ data: projects });
		}
	)
	.get("/:projectId", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { projectId } = c.req.param();

		const project = await databases.getDocument<Project>(
			DATABASE_ID,
			PROJECTS_ID,
			projectId
		);

		const member = await getMember({
			databases,
			workspaceId: project.workspaceId,
			userId: user.$id,
		});

		if (!member) {
			return c.json({ error: "Unauthorized" }, 401);
		}
		return c.json({ data: project });
	})
	.get("/:projectId/analytics", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { projectId } = c.req.param();

		const project = await databases.getDocument<Project>(
			DATABASE_ID,
			PROJECTS_ID,
			projectId
		);

		const member = await getMember({
			databases,
			workspaceId: project.workspaceId,
			userId: user.$id,
		});
		if (!member) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		const now = new Date();
		const thisMonthStart = startOfMonth(now);
		const thisMonthEnd = endOfMonth(now);
		const lastMonthStart = startOfMonth(subMonths(now, 1));
		const lastMonthEnd = endOfMonth(subMonths(now, 1));

		const thisMonthTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("projectId", projectId),
				Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
			]
		);
		const lastMonthTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("projectId", projectId),
				Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
			]
		);

		const taskCount = thisMonthTasks.total;
		const taskDiff = taskCount - lastMonthTasks.total;

		const thisMonthAssignedTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("projectId", projectId),
				Query.equal("assigneeId", member.$id),
				Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
			]
		);
		const lastMonthAssignedTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("projectId", projectId),
				Query.equal("assigneeId", member.$id),
				Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
			]
		);

		const assignedTaskCount = thisMonthAssignedTasks.total;
		const assignedTaskDiff = assignedTaskCount - lastMonthAssignedTasks.total;

		const thisMonthIncompleteTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("projectId", projectId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
			]
		);
		const lastMonthIncompleteTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("projectId", projectId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
			]
		);

		const incompleteTaskCount = thisMonthIncompleteTasks.total;
		const incompleteTaskDiff =
			incompleteTaskCount - lastMonthIncompleteTasks.total;

		const thisMonthCompletedTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("projectId", projectId),
				Query.equal("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
			]
		);
		const lastMonthCompletedTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("projectId", projectId),
				Query.equal("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
			]
		);

		const completedTaskCount = thisMonthCompletedTasks.total;
		const completeTaskDiff = completedTaskCount - lastMonthCompletedTasks.total;

		const thisMonthOverDueTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("projectId", projectId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.lessThan("dueDate", now.toISOString()),
				Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
			]
		);
		const lastMonthOverDueTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("projectId", projectId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.lessThan("dueDate", now.toISOString()),
				Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
			]
		);

		const overdueTaskCount = thisMonthOverDueTasks.total;
		const overdueTaskDiff = overdueTaskCount - lastMonthOverDueTasks.total;

		return c.json({
			data: {
				taskCount,
				taskDiff,
				assignedTaskCount,
				assignedTaskDiff,
				incompleteTaskCount,
				incompleteTaskDiff,
				completedTaskCount,
				completeTaskDiff,
				overdueTaskCount,
				overdueTaskDiff,
			},
		});
	})
	.patch(
		"/:projectId",
		sessionMiddleware,
		zValidator("form", updateProjectSchema),
		async (c) => {
			const databases = c.get("databases");
			const storage = c.get("storage");
			const user = c.get("user");

			const { projectId } = c.req.param();
			const { name, image } = c.req.valid("form");

			const existingProject = await databases.getDocument<Project>(
				DATABASE_ID,
				PROJECTS_ID,
				projectId
			);
			const member = await getMember({
				databases,
				workspaceId: existingProject.workspaceId,
				userId: user.$id,
			});

			if (!member) {
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
			const updatedProject = await databases.updateDocument(
				DATABASE_ID,
				PROJECTS_ID,
				projectId,
				{
					name,
					imageUrl: uploadedImage,
				}
			);

			return c.json({ data: updatedProject });
		}
	)
	.delete("/:projectId", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { projectId } = c.req.param();

		const existingProject = await databases.getDocument<Project>(
			DATABASE_ID,
			PROJECTS_ID,
			projectId
		);

		const member = await getMember({
			databases,
			workspaceId: existingProject.workspaceId,
			userId: user.$id,
		});
		if (!member) {
			return c.json({ error: "Unauthorized" }, 401);
		}
		// TODO: delete  tasks
		await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);
		return c.json({ data: { $id: existingProject.$id } });
	});

export default app;
