import { useQueryState,parseAsString } from "nuqs";

export const useEditTaskModal = () => {
	const [taskId, setTaskId] = useQueryState("edit-task", parseAsString);

	const open = (id: string) => setTaskId(id);
	const close = () => setTaskId(null);
	return {
		taskId,
		open,
		close,
		setTaskId,
	};
};
