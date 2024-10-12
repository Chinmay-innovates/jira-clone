"use client";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PropsWithChildren } from "react";
import Link from "next/link";

const AuthLayout = ({ children }: PropsWithChildren) => {
	const pathname = usePathname();
	const isSignIn = pathname === "/sign-in";
	return (
		<main className="bg-neutral-100 min-h-screen">
			<div className="mx-auto max-w-screen-2xl p-4">
				<nav className="flex items-center justify-between">
					<Image src="/logo.png" width={150} height={56} alt="logo" />

					<Button asChild variant="secondary">
						<Link href={isSignIn ? "/sign-up" : "/sign-in"}>
							{isSignIn ? "Sign Up" : "Login"}
						</Link>
					</Button>
				</nav>
				<div className="flex flex-col items-center justify-center pt-4 md:py-14">
					{children}
				</div>
			</div>
		</main>
	);
};
export default AuthLayout;
