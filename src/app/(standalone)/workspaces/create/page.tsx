import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

const CreateWorkspacePage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");
	return (
		<div className="w-full lg:max-w-xl">
			<CreateWorkspaceForm />
		</div>
	);
};

export default CreateWorkspacePage;
