import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetProjectProps {
	projectId: string;
}
export const useGetProject = ({ projectId }: useGetProjectProps) => {
	const query = useQuery({
		queryKey: ["project", projectId],
		queryFn: async () => {
			const response = await client.api.projects[":projectId"].$get({
				param: { projectId },
			});
			if (!response.ok) {
				throw new Error("Failed to get project");
			}
			const { data } = await response.json();
			return data;
		},
	});

	return query;
};
