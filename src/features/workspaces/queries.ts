import { Query } from "node-appwrite";

import { getMember } from "@/features/members/utilts";

import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";

import { Workspace } from "./types";

export const getWorkspaces = async () => {
	const { account, databases } = await createSessionClient();
	const user = await account.get();

	const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
		Query.equal("userId", user.$id),
	]);

	if (members.total == 0) {
		return { documents: [], total: 0 };
	}
	const workspaceIds = members.documents.map((member) => member.workspaceId);
	const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACE_ID, [
		Query.orderDesc("$createdAt"),
		Query.contains("$id", workspaceIds),
	]);

	return workspaces;
};

interface GetWorkspaceProps {
	workspaceId: string;
}
export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
	const { account, databases } = await createSessionClient();
	const user = await account.get();

	const member = await getMember({
		databases,
		workspaceId,
		userId: user.$id,
	});
	if (!member) {
		throw new Error("Unauthorized");
	}

	const workspaces = await databases.getDocument<Workspace>(
		DATABASE_ID,
		WORKSPACE_ID,
		workspaceId
	);

	return workspaces;
};

interface GetWorkspaceInfoProps {
	workspaceId: string;
}
export const getWorkspaceInfo = async ({
	workspaceId,
}: GetWorkspaceInfoProps) => {
	const { databases } = await createSessionClient();

	const workspace = await databases.getDocument<Workspace>(
		DATABASE_ID,
		WORKSPACE_ID,
		workspaceId
	);

	return {
		name: workspace.name,
	};
};
