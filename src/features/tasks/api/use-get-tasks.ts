import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetTasksProps {
	workspaceId: string;
}
export const useGetTasks = ({ workspaceId }: useGetTasksProps) => {
	const query = useQuery({
		queryKey: ["tasks", workspaceId],
		queryFn: async () => {
			const response = await client.api.tasks.$get({
				query: { workspaceId },
			});
			if (!response.ok) {
				throw new Error("Failed to get tasks");
			}
			const { documents, total } = await response.json();
			return {
				documents,
				total,
			};
		},
	});

	return query;
};
