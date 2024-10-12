import { getCurrent } from "@/features/auth/queries";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { getWorkspace } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingsPageProps {
	params: {
		workspaceId: string;
	};
}
const WorkspaceIdSettingsPage = async ({
	params,
}: WorkspaceIdSettingsPageProps) => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");
	const initialValues = await getWorkspace({ workspaceId: params.workspaceId });
	if (!initialValues) redirect(`/workspaces/${params.workspaceId}`);

	return (
		<div className="w-full lg:max-w-xl">
			<EditWorkspaceForm initialValues={initialValues} />
		</div>
	);
};

export default WorkspaceIdSettingsPage;
