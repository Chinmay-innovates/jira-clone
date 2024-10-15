import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

import { WorkspaceIdSettingsClient } from "./client";

const WorkspaceIdSettingsPage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");

	return <WorkspaceIdSettingsClient />;
};

export default WorkspaceIdSettingsPage;
