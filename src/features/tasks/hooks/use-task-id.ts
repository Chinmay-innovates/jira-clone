import { useParams } from "next/navigation";

export const UseTaskId = () => {
	const params = useParams();
	return params.taskId as string;
};
