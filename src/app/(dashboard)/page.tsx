import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";

export default async function Home() {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");

	const workspaces = await getWorkspaces();
	if (workspaces.total === 0) {
		redirect("/workspaces/create");
	} else {
		redirect(`/workspaces/${workspaces.documents[0].$id}`);
	}
}
