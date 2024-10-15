import { useState } from "react";
import { Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";

import { Task } from "../types";
import { useUpdateTask } from "../api/use-update-task";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionProps {
	task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [value, setValue] = useState(task.description);
	const { mutate, isPending } = useUpdateTask();

	const handleSave = () => {
		mutate({
			json: { description: value },
			param: { taskId: task.$id },
		},{
			onSuccess: () => setIsEditing(false),
		});
	};
	return (
		<div className="p-4 border rounded-lg">
			<div className="flex items-center justify-between">
				<p className="text-lg font-semibold">Overview</p>
				<Button
					onClick={() => setIsEditing((prev) => !prev)}
					size="sm"
					variant="secondary"
				>
					{isEditing ? (
						<X className="size-4 mr-2" />
					) : (
						<Pencil className="size-4 mr-2" />
					)}
					{isEditing ? "Cancel" : "Edit"}
				</Button>
			</div>
			<DottedSeparator className="my-4" />
			{isEditing ? (
				<div className="flex flex-col gap-y-4">
					<Textarea
						placeholder="Add a description..."
						value={value}
						rows={4}
						onChange={(e) => setValue(e.target.value)}
						disabled={isPending}
					/>
					<Button
						size="sm"
						className="w-fit ml-auto"
						onClick={handleSave}
						disabled={isPending}
					>
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			) : (
				<div>
					{task.description || (
						<span className="text-muted-foreground">No description set</span>
					)}
				</div>
			)}
		</div>
	);
};
