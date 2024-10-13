import { getCurrent } from "@/features/auth/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

interface ProjectIdSettingsPageProps {
	params: {
		workspaceId: string;
		projectId: string;
	};
}
const ProjectIdSettingsPage = async ({
	params,
}: ProjectIdSettingsPageProps) => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");
	const initialValues = await getProject({ projectId: params.projectId });
	return (
		<div className="w-full lg:max-w-xl">
			<EditProjectForm initialValues={initialValues} />
		</div>
	);
};

export default ProjectIdSettingsPage;
