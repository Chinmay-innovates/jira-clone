import { getCurrent } from "@/features/auth/queries";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";

export default async function Home() {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");

	return (
		<div className="bg-neutral-500 p-4 w-full">
			<CreateWorkspaceForm />
		</div>
	);
}
