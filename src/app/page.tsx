"use client";

import { Button } from "@/components/ui/button";
import { useCurrent } from "@/features/auth/api/use-curent";
import { useLogout } from "@/features/auth/api/use-logout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const { data, isLoading } = useCurrent();
	const { mutate } = useLogout();
	const router = useRouter();
	useEffect(() => {
		if (!data && !isLoading) {
			router.push("/sign-in");
		}
	}, [data]);
	return (
		<div className="text-green-500 text-4xl">
			Home page
			<Button onClick={() => mutate()}>Log out</Button>
		</div>
	);
}
