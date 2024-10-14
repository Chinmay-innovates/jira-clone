import { Loader } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { EditTaskForm } from "./edit-task-form";

interface EditTaskFormWrapperProps {
	onCancel: () => void;
	id: string;
}

export const EditTaskFormWrapper = ({
	onCancel,
	id,
}: EditTaskFormWrapperProps) => {
	const workspaceId = useWorkspaceId();

	const { data: initialValues, isLoading: taskLoading } = useGetTask({
		taskId: id,
	});

	const { data: projects, isLoading: loadingProjects } = useGetProjects({
		workspaceId: workspaceId,
	});

	const { data: members, isLoading: loadingMembers } = useGetMembers({
		workspaceId: workspaceId,
	});

	const projectOptions = projects?.documents.map((project) => ({
		id: project.$id,
		name: project.name,
		imageUrl: project.imageUrl,
	}));

	const memberOptions = members?.documents.map((project) => ({
		id: project.$id,
		name: project.name,
	}));

	const isLoading = loadingProjects || loadingMembers || taskLoading;

	if (isLoading) {
		return (
			<Card className="w-full h-[714px] border-none shadow-none">
				<CardContent className="flex items-center justify-center h-full">
					<Loader className="size-5 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}
	if (!initialValues) return null;
	return (
		<EditTaskForm
			initialValues={initialValues}
			onCancel={onCancel}
			memberOptions={memberOptions ?? []}
			projectOptions={projectOptions ?? []}
		/>
	);
};
