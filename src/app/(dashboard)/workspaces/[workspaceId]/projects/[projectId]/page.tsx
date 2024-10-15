import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { ProjectIdClient } from "./client";

const ProjectIdPage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");
	
	return <ProjectIdClient />;
};

export default ProjectIdPage;
