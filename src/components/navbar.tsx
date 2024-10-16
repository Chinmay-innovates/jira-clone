"use client";
import { usePathname } from "next/navigation";

import { UserButton } from "@/features/auth/components/user-button";

import { MobileSidebar } from "./mobile-sidebar";

const pathnameMap = {
	tasks: {
		title: "My Tasks",
		description: "View all of your tasks here",
	},
	projects: {
		title: "My Projects",
		description: "View tasks of your project here",
	},
};
const defaultMap = {
	title: "Home",
	description: "Monitor all of your projects and tasks here",
};
export const Navbar = () => {
	const pathname = usePathname();
	const parts = pathname.split("/");
	const pathnameKey = parts[3] as keyof typeof pathnameMap;

	const { description, title } = pathnameMap[pathnameKey] || defaultMap;
	return (
		<nav className="pt-4 px-6 flex items-center justify-between">
			<div className="flex-col hidden lg:flex">
				<h1 className="text-2xl font-bold">{title}</h1>
				<p className="text-muted-foreground">{description}</p>
			</div>
			<MobileSidebar />
			<UserButton />
		</nav>
	);
};
