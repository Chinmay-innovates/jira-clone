import { useRouter } from "next/navigation";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useDeleteTask } from "../api/use-delete-task";
import { useEditTaskModal } from "../hooks/use-update-task-modal";
interface TaskActionsProps {
	id: string;
	projectId: string;
	children: React.ReactNode;
}

export const TaskActions = ({ children, id, projectId }: TaskActionsProps) => {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const { open } = useEditTaskModal();
	const [ConfirmDialog, confirm] = useConfirm(
		"Delete Task",
		"Are you sure you want to delete this task?",
		"destructive"
	);
	const { mutate, isPending } = useDeleteTask();
	const onDelete = async () => {
		const ok = await confirm();
		if (!ok) return;
		mutate({ param: { taskId: id } });
	};

	const onOpenTask = () => {
		router.push(`/workspaces/${workspaceId}/tasks/${id}`);
	};
	const onOpenProject = () => {
		router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
	};
	return (
		<div className="flex justify-end">
			<ConfirmDialog />
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem
						onClick={onOpenTask}
						className="font-medium p-[10px]"
					>
						<ExternalLinkIcon className="size-5 mr-2 sroke-2" />
						Task Details
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={onOpenProject}
						className="font-medium p-[10px]"
					>
						<ExternalLinkIcon className="size-5 mr-2 sroke-2" />
						Open Project
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => open(id)}
						className="font-medium p-[10px]"
					>
						<PencilIcon className="size-5 mr-2 sroke-2" />
						Edit Task
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={onDelete}
						disabled={isPending}
						className="font-medium p-[10px] text-amber-700 focus:text-amber-700"
					>
						<TrashIcon className="size-5 mr-2 sroke-2" />
						Delete Task
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
