"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVerticalIcon } from "lucide-react";

import { snakeCaseToTitleCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/features/tasks/types";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/members-avatar";

import { TaskDate } from "./task-date";
import { TaskActions } from "./task-actions";

export const columns: ColumnDef<Task>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Task Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const name = row.original.name;
			return <p className="line-clamp-1">{name}</p>;
		},
	},
	{
		accessorKey: "project",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Project
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const project = row.original.project;
			return (
				<div className="flex items-center gap-x-2 font-medium">
					<ProjectAvatar
						image={project.imageUrl}
						className="size-6"
						name={project.name}
					/>
					<p className="line-clamp-1">{project.name}</p>
				</div>
			);
		},
	},
	{
		accessorKey: "assignee",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Assignee
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const assignee = row.original.assignee;
			return (
				<div className="flex items-center gap-x-2 font-medium">
					<MemberAvatar
						fallbackClassName="text-xs"
						className="size-6"
						name={assignee.name}
					/>
					<p className="line-clamp-1">{assignee.name}</p>
				</div>
			);
		},
	},
	{
		accessorKey: "dueDate",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Due Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const dueDate = row.original.dueDate;
			return <TaskDate value={dueDate} />;
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const status = row.original.status;
			return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const id = row.original.$id;
			const projectId = row.original.project.$id;
			return (
				<TaskActions id={id} projectId={projectId}>
					<Button variant="ghost" className="size-8 p-0">
						<MoreVerticalIcon className="size-4" />
					</Button>
				</TaskActions>
			);
		},
	},
];
