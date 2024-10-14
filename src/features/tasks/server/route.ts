import { z } from "zod";
import { Hono } from "hono";

import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { getMember } from "@/features/members/utilts";
import { sessionMiddleware } from "@/lib/session-middleware";

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { createAdminClient } from "@/lib/appwrite";

import { createTaskSchema } from "../schemas";
import { Task, TaskStatus } from "../types";
import { Project } from "@/features/projects/types";
const app = new Hono()
	.get(
		"/",
		sessionMiddleware,
		zValidator(
			"query",
			z.object({
				workspaceId: z.string(),
				projectId: z.string().nullish(),
				assigneeId: z.string().nullish(),
				search: z.string().nullish(),
				dueDate: z.string().nullish(),
				status: z.nativeEnum(TaskStatus).nullish(),
			})
		),
		async (c) => {
			const { users } = await createAdminClient();
			const databases = c.get("databases");
			const user = c.get("user");
			const { workspaceId, projectId, assigneeId, status, search, dueDate } =
				c.req.valid("query");

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

			if (!member) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const query = [
				Query.equal("workspaceId", workspaceId),
				Query.orderDesc("$createdAt"),
			];

			if (projectId) {
				console.log("ProjectId:", projectId);
				query.push(Query.equal("projectId", projectId));
			}
			if (status) {
				console.log("status:", status);
				query.push(Query.equal("status", status));
			}
			if (assigneeId) {
				console.log("assigneeId:", assigneeId);
				query.push(Query.equal("assigneeId", assigneeId));
			}
			if (dueDate) {
				console.log("dueDate:", dueDate);
				query.push(Query.equal("dueDate", dueDate));
			}
			if (search) {
				console.log("search:", search);
				query.push(Query.search("name", search));
			}

			const tasks = await databases.listDocuments<Task>(
				DATABASE_ID,
				TASKS_ID,
				query
			);

			const projectIds = tasks.documents.map((task) => task.projectId);
			const assigneeIds = tasks.documents.map((task) => task.assigneeId);

			const projects = await databases.listDocuments<Project>(
				DATABASE_ID,
				PROJECTS_ID,
				projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
			);

			const members = await databases.listDocuments(
				DATABASE_ID,
				MEMBERS_ID,
				assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
			);

			const assignees = await Promise.all(
				members.documents.map(async (member) => {
					const user = await users.get(member.userId);
					return {
						...member,
						name: user.name,
						email: user.email,
					};
				})
			);

			const populatedTask = tasks.documents.map((task) => {
				const project = projects.documents.find(
					(project) => project.$id === task.projectId
				);
				const assignee = assignees.find(
					(assignee) => assignee.$id === task.assigneeId
				);
				return {
					...task,
					project,
					assignee,
				};
			});

			return c.json({
				data: {
					...tasks,
					documents: populatedTask,
				},
			});
		}
	)
	.post(
		"/",
		sessionMiddleware,
		zValidator("json", createTaskSchema),
		async (c) => {
			const databases = c.get("databases");
			const user = c.get("user");
			const { name, status, dueDate, projectId, assigneeId, workspaceId } =
				c.req.valid("json");

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

			if (!member) {
				return c.json({ error: "Unauthorized" }, 401);
			}
			const highestPositionTask = await databases.listDocuments(
				DATABASE_ID,
				TASKS_ID,
				[
					Query.equal("status", status),
					Query.equal("workspaceId", workspaceId),
					Query.orderAsc("position"),
					Query.limit(1),
				]
			);
			const newPosition =
				highestPositionTask.documents.length > 0
					? highestPositionTask.documents[0].position + 1000
					: 1000;

			const task = await databases.createDocument(
				DATABASE_ID,
				TASKS_ID,
				ID.unique(),
				{
					name,
					status,
					dueDate,
					workspaceId,
					projectId,
					assigneeId,
					position: newPosition,
				}
			);
			return c.json({ data: task });
		}
	);

export default app;
