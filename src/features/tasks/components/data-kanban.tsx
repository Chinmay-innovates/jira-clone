import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from "@hello-pangea/dnd";
import { Task, TaskStatus } from "../types";
import React from "react";
import { KanbanColumnHeader } from "./kanban-column-header";

const boards: TaskStatus[] = [
	TaskStatus.BACKlOG,
	TaskStatus.TODO,
	TaskStatus.IN_PROGRESS,
	TaskStatus.IN_REVIEW,
	TaskStatus.DONE,
];

type TaskState = {
	[key in TaskStatus]: Task[];
};
interface DataKanbanProps {
	data: Task[];
}

export const DataKanban = ({ data }: DataKanbanProps) => {
	const [tasks, setTasks] = React.useState<TaskState>(() => {
		const initialTasks: TaskState = {
			[TaskStatus.BACKlOG]: [],
			[TaskStatus.TODO]: [],
			[TaskStatus.IN_PROGRESS]: [],
			[TaskStatus.IN_REVIEW]: [],
			[TaskStatus.DONE]: [],
		};

		data.forEach((task) => {
			initialTasks[task.status].push(task);
		});

		Object.keys(initialTasks).forEach((key) => {
			initialTasks[key as TaskStatus].sort((a, b) => a.position - b.position);
		});

		return initialTasks;
	});
	return (
		<DragDropContext onDragEnd={() => {}}>
			<div className="flex overflow-x-auto">
				{boards.map((board) => (
					<div
						key={board}
						className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
					>
						<KanbanColumnHeader board={board} taskCount={tasks[board].length} />
					</div>
				))}
			</div>
		</DragDropContext>
	);
};
