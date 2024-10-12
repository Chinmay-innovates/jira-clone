import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

const WorkspaceIdpage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");
	return <div>WorkspaceIdpage</div>;
};

export default WorkspaceIdpage;
