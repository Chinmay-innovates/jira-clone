import { getCurrent } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { redirect } from "next/navigation";

const TasksPage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");

	return (
		<div className="h-full flex flex-col">
			<TaskViewSwitcher />
		</div>
	);
};

export default TasksPage;
