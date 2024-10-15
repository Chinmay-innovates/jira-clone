"use client";

import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";

import { useGetTask } from "@/features/tasks/api/use-get-task";
import { UseTaskId } from "@/features/tasks/hooks/use-task-id";
import { DottedSeparator } from "@/components/dotted-separator";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { TaskDescription } from "@/features/tasks/components/task-description";
import { TasksBreadcrumbs } from "@/features/tasks/components/tasks-breadcrumbs";

export const TaskIdClient = () => {
	const taskId = UseTaskId();
	const { data, isLoading } = useGetTask({ taskId });

	if (isLoading) return <PageLoader />;

	if (!data) return <PageError />;

	return (
		<div className="flex flex-col">
			<TasksBreadcrumbs task={data} project={data.project} />
			<DottedSeparator className="my-6" />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<TaskOverview task={data} />
				<TaskDescription task={data} />
			</div>
		</div>
	);
};
