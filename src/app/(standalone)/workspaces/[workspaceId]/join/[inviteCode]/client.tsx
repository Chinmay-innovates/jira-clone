"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { useInviteCode } from "@/features/workspaces/hooks/use-invite-code";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const WorkspaceIdJoinClient = () => {
	const workspaceId = useWorkspaceId();
	const inviteCode = useInviteCode();
	const { data: initialValues, isLoading } = useGetWorkspaceInfo({
		workspaceId,
	});

	if (isLoading) return <PageLoader />;
	if (!initialValues) return <PageError message="Workspace not found" />;

	return (
		<div className="w-full lg:max-w-xl">
			<JoinWorkspaceForm
				initialValues={initialValues}
				workspaceId={workspaceId}
				code={inviteCode}
			/>
		</div>
	);
};
