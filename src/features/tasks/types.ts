import { Models } from "node-appwrite";
export type Task = Models.Document & {
	name: string;
	status: TaskStatus;
	assigneeId: string;
	workspaceId: string;
	projectId: string;
	position: number;
	dueDate: string;
	description?: string;
};

export enum TaskStatus {
	BACKlOG = "BACKLOG",
	TODO = "TODO",
	IN_PROGRESS = "IN_PROGRESS",
	IN_REVIEW = "IN_REVIEW",
	DONE = "DONE",
}
