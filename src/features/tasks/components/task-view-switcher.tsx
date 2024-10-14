"use client";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useGetTasks } from "../api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useQueryState } from "nuqs";
import { DataFilters } from "./data-filters";
import { useTaskFilter } from "../hooks/use-task-filter";

export const TaskViewSwitcher = () => {
	const [{ status, dueDate, assigneeId, projectId }] = useTaskFilter();

	const [view, setView] = useQueryState("task-view", {
		defaultValue: "table",
	});
	const { open } = useCreateTaskModal();
	const workspaceId = useWorkspaceId();
	const { data: tasks, isLoading: tasksLoading } = useGetTasks({
		workspaceId,
		assigneeId,
		projectId,
		dueDate,
		status,
	});
	return (
		<Tabs
			defaultValue={view}
			onValueChange={setView}
			className="flex-1 w-full border rounded-lg"
		>
			<div className="h-full flex flex-col overflow-auto p-4">
				<div className="flex  lg:flex-row gap-y-2 items-center justify-start w-full">
					<TabsList className="w-full lg:w-auto">
						<TabsTrigger className="h-8 w-full lg:w-auto" value="table">
							Table
						</TabsTrigger>
					</TabsList>
					<TabsList className="w-full lg:w-auto">
						<TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
							Kanban
						</TabsTrigger>
					</TabsList>
					<TabsList className="w-full lg:w-auto">
						<TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
							Calendar
						</TabsTrigger>
					</TabsList>
					<Button onClick={open} size="sm" className="w-full lg:w-auto">
						<Plus className="size-4 mr-2" />
						New
					</Button>
				</div>
				<DottedSeparator className="my-4" />
				<DataFilters />
				<DottedSeparator className="my-4" />
				{tasksLoading ? (
					<div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
						<Loader className="size-5 animate-spin text-muted-foreground" />
					</div>
				) : (
					<>
						<TabsContent value="table" className="mt-0">
							<DataTable columns={columns} data={tasks?.documents ?? []} />
						</TabsContent>
						<TabsContent value="kanban" className="mt-0">
							Data Kanban
						</TabsContent>
						<TabsContent value="calendar" className="mt-0">
							Data Calendar
						</TabsContent>
					</>
				)}
			</div>
		</Tabs>
	);
};
