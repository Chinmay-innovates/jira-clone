import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetWorkspaceInfo {
	workspaceId: string;
}
export const useGetWorkspaceInfo = ({ workspaceId }: useGetWorkspaceInfo) => {
	const query = useQuery({
		queryKey: ["workspace-info", workspaceId],
		queryFn: async () => {
			const response = await client.api.workspaces[":workspaceId"]["info"].$get(
				{
					param: { workspaceId },
				}
			);
			if (!response.ok) {
				throw new Error("Failed to get workspace info");
			}
			const { data } = await response.json();
			return data;
		},
	});

	return query;
};
