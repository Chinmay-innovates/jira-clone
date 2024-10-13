"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { cn } from "@/lib/utils";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

export const Projects = () => {
	const pathname = usePathname();
	const workspaceId = useWorkspaceId();

	const { open } = useCreateProjectModal();
	const { data } = useGetProjects({ workspaceId });

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex items-center justify-between">
				<p className="text-xs uppercase text-neutral-500">Projects</p>
				<RiAddCircleFill
					onClick={open}
					className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
				/>
			</div>
			{data?.documents.map((project) => {
				const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
				const isActive = pathname === href;
				return (
					<Link href={href} key={project.$id}>
						<div
							className={cn(
								"flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
								isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
							)}
						>
							<ProjectAvatar image={project.imageUrl} name={project.name} />
							<span className="truncate">{project.name}</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
};
