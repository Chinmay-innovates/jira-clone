import { FolderIcon, ListChecksIcon, UserCog2 } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetMembers } from "@/features/members/api/use-get-members";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { TaskStatus } from "../types";
import { useTaskFilter } from "../hooks/use-task-filter";
import { DatePicker } from "@/components/date-picker";

interface DataFiltersProps {
	hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
	const workspaceId = useWorkspaceId();
	const { data: projects, isLoading: projectsLoading } = useGetProjects({
		workspaceId,
	});
	const { data: members, isLoading: membersLoading } = useGetMembers({
		workspaceId,
	});
	const isLoading = projectsLoading || membersLoading;

	const projectOptions = projects?.documents.map((project) => ({
		value: project.$id,
		label: project.name,
	}));
	const memberOptions = members?.documents.map((member) => ({
		value: member.$id,
		label: member.name,
	}));

	const [{ status, dueDate, assigneeId, projectId }, setFilters] =
		useTaskFilter();

	const onStatusChange = (value: string) => {
		setFilters({ status: value === "all" ? null : (value as TaskStatus) });
	};

	const onAssigneeChange = (value: string) => {
		setFilters({ assigneeId: value === "all" ? null : (value as string) });
	};

	const onProjectChange = (value: string) => {
		setFilters({ projectId: value === "all" ? null : (value as string) });
	};

	if (isLoading) return null;

	return (
		<div className="flex flex-col lg:flex-row gap-2">
			<Select
				defaultValue={status ?? undefined}
				onValueChange={(value) => onStatusChange(value)}
			>
				<SelectTrigger className="w-full lg:w-auto h-8">
					<div className="flex items-center pr-2">
						<ListChecksIcon className="size-4 mr-2" />
						<SelectValue placeholder="All status" />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All status</SelectItem>
					<SelectSeparator />
					{Object.entries(TaskStatus).map(([key, value]) => (
						<SelectItem key={value} value={value}>
							{key
								.replace("_", " ")
								.toLowerCase()
								.replace(/\b\w/g, (char) => char.toUpperCase())}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				defaultValue={assigneeId ?? undefined}
				onValueChange={(value) => onAssigneeChange(value)}
			>
				<SelectTrigger className="w-full lg:w-auto h-8">
					<div className="flex items-center pr-2">
						<UserCog2 className="size-4 mr-2" />
						<SelectValue placeholder="All assignee" />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All assignee</SelectItem>
					<SelectSeparator />
					{memberOptions?.map((member) => (
						<SelectItem key={member.value} value={member.value}>
							{member.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{!hideProjectFilter && (
				<Select
					defaultValue={projectId ?? undefined}
					onValueChange={(value) => onProjectChange(value)}
				>
					<SelectTrigger className="w-full lg:w-auto h-8">
						<div className="flex items-center pr-2">
							<FolderIcon className="size-4 mr-2" />
							<SelectValue placeholder="All projects" />
						</div>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All projects</SelectItem>
						<SelectSeparator />
						{projectOptions?.map((project) => (
							<SelectItem key={project.value} value={project.value}>
								{project.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
			<DatePicker
				placeholder="Due date"
				className="w-full lg:w-auto h-8"
				value={dueDate ? new Date(dueDate) : undefined}
				onChange={(date) =>
					setFilters({ dueDate: date ? date.toISOString() : null })
				}
			/>
		</div>
	);
};
