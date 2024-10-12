import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<ResponseType, Error>({
		mutationFn: async () => {
			const response = await client.api.auth.logout.$post();
			return await response.json();
		},
		onSuccess: () => {
			toast.success("Logged out successfully");
			queryClient.invalidateQueries({ queryKey: ["current"] });
		},
	});

	return mutation;
};
