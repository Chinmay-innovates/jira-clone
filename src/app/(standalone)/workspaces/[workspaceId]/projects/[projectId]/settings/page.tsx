import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

import { ProjectIdSettingsClient } from "./client";
const ProjectIdSettingsPage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");
	return <ProjectIdSettingsClient />;
};

export default ProjectIdSettingsPage;
