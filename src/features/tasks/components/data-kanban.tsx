import React, { useCallback, useEffect } from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
} from "@hello-pangea/dnd";
import { Task, TaskStatus } from "../types";
import { KanbanCard } from "./kanban-card";
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
	onChange: (
		tasks: {
			$id: string;
			status: TaskStatus;
			position: number;
		}[]
	) => void;
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
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

	useEffect(() => {
		const newTasks: TaskState = {
			[TaskStatus.BACKlOG]: [],
			[TaskStatus.TODO]: [],
			[TaskStatus.IN_PROGRESS]: [],
			[TaskStatus.IN_REVIEW]: [],
			[TaskStatus.DONE]: [],
		};

		data.forEach((task) => {
			newTasks[task.status].push(task);
		});

		Object.keys(newTasks).forEach((key) => {
			newTasks[key as TaskStatus].sort((a, b) => a.position - b.position);
		});

		setTasks(newTasks);
	}, [data]);

	const onDragEnd = useCallback(
		(result: DropResult) => {
			if (!result.destination) return;
			const { source, destination } = result;
			const sourceStatus = source.droppableId as TaskStatus;
			const destinationStatus = destination.droppableId as TaskStatus;

			let updatesPayload: {
				$id: string;
				status: TaskStatus;
				position: number;
			}[] = [];

			setTasks((prev) => {
				const newTasks = { ...prev };
				// Safely remove task from source column
				const sourceTasks = [...newTasks[sourceStatus]];
				const [movedTask] = sourceTasks.splice(source.index, 1);

				// If there is no moved task, return the previous state
				if (!movedTask) {
					console.error("No task found in source index");
					return prev;
				}

				// Create a new task object with potentiallu updated status
				const updatedTask =
					sourceStatus !== destinationStatus
						? { ...movedTask, status: destinationStatus }
						: movedTask;

				// Updating the source column
				newTasks[sourceStatus] = sourceTasks;

				// Add the updated task to the destination column
				const destinationColumn = [...newTasks[destinationStatus]];
				destinationColumn.splice(destination.index, 0, updatedTask);
				newTasks[destinationStatus] = destinationColumn;

				// Prepare minimal update payload
				updatesPayload = [];

				// Always update the the moved task
				updatesPayload.push({
					$id: movedTask.$id,
					status: destinationStatus,
					position: Math.min((destination.index + 1) * 1000, 1_000_000),
				});

				// Update the positions for affected tasks in the destination column
				newTasks[destinationStatus].forEach((task, index) => {
					if (task && task.$id !== updatedTask.$id) {
						const newPosition = Math.min((index + 1) * 1000, 1_000_000);
						if (task.position !== newPosition) {
							updatesPayload.push({
								$id: task.$id,
								status: destinationStatus,
								position: newPosition,
							});
						}
					}
				});

				// If  the task moved between columns, update position in the soure column
				if (sourceStatus !== destinationStatus) {
					newTasks[sourceStatus].forEach((task, index) => {
						if (task) {
							const newPosition = Math.min((index + 1) * 1000, 1_000_000);
							if (task.position !== newPosition) {
								updatesPayload.push({
									$id: task.$id,
									status: sourceStatus,
									position: newPosition,
								});
							}
						}
					});
				}

				return newTasks;
			});
			onChange(updatesPayload);
		},
		[onChange]
	);
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="flex overflow-x-auto">
				{boards.map((board) => (
					<div
						key={board}
						className="flex-1 mx-2 bg-muted-foreground/20 p-1.5 rounded-md min-w-[200px]"
					>
						<KanbanColumnHeader board={board} taskCount={tasks[board].length} />
						<Droppable key={board} droppableId={board}>
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="min-h-[200px] py-1.5"
								>
									{tasks[board].map((task, index) => (
										<Draggable
											key={task.$id}
											draggableId={task.$id}
											index={index}
										>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
												>
													<KanbanCard task={task} />
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
				))}
			</div>
		</DragDropContext>
	);
};
