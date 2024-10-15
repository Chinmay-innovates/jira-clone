import { MoreHorizontalIcon } from "lucide-react";
import { Task } from "../types";
import { TaskActions } from "./task-actions";
import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { TaskDate } from "./task-date";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface KanbanCardProps {
	task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
	return (
		<div className="bg-white p-2.5 mb-1.5 rounded shadow-md space-y-3">
			<div className="flex items-start justify-between gap-x-2">
				<p className="line-clamp-2">{task.name}</p>
				<TaskActions id={task.$id} projectId={task.projectId}>
					<MoreHorizontalIcon className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
				</TaskActions>
			</div>
			<DottedSeparator />
			<div className="flex items-center gap-x-1.5">
				<MemberAvatar
					name={task.assignee.name}
					fallbackClassName="text-[10px]"
				/>
				<div className="dot" />
				<TaskDate value={task.dueDate} className="text-xs" />
			</div>
			<div className="flex items-center gap-x-1.5">
				<ProjectAvatar
					name={task.project.name}
					image={task.project.imageUrl}
					fallbackClassName="text-[10px]"
				/>
				<span className="text-xs font-medium">{task.project.name}</span>
			</div>
		</div>
	);
};
