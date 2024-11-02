import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Jira Clone",
	description:
		"Plan, track, and manage your agile and software development projects in Jira. Customize your workflow, collaborate, and release great software",
	icons: {
		icon: "/favicon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn(inter.className, "antialiased min-h-screen")}>
				<QueryProvider>
					<Toaster richColors theme="light" />
					{children}
				</QueryProvider>
			</body>
		</html>
	);
}
