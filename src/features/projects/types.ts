import { Models } from "node-appwrite";

export type Project = Models.Document & {
	name: string;
	imageUrl: string;
	projectId: string;
};
