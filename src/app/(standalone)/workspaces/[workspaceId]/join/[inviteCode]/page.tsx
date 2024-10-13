import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";

interface WorkspaceIdJoinPageProps {
	params: {
		workspaceId: string;
	};
}
const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");
	const workspaceInfo = await getWorkspaceInfo({
		workspaceId: params.workspaceId,
	});
	if (!workspaceInfo) {
		redirect("/");
	}

	return (
		<div className="w-full lg:max-w-xl">
			<JoinWorkspaceForm initialValues={workspaceInfo} />
		</div>
	);
};

export default WorkspaceIdJoinPage;
