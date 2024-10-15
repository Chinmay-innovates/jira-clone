import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { WorkspaceIdJoinClient } from "./client";

const WorkspaceIdJoinPage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");
	return <WorkspaceIdJoinClient />;
};

export default WorkspaceIdJoinPage;
