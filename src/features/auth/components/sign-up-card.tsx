"use client";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type RegisterSchema, registerSchema } from "../schemas";
import { useRegister } from "../api/use-register";

export const SignUpCard = () => {
	const { mutate, isPending } = useRegister();
	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = (values: RegisterSchema) => {
		mutate({ json: values });
	};
	return (
		<Card className="size-full md:w-[487px] border-none shadow-none">
			<CardHeader className="flexx items-center justify-center text-center p-7">
				<CardTitle className="text-2xl">Sign Up</CardTitle>
				<CardDescription>
					By signing up, you agree to our{" "}
					<Link href="/privacy">
						<span className="text-blue-700">Privacy Policy</span>
					</Link>{" "}
					and{" "}
					<Link href="/terms">
						<span className="text-blue-700">terms</span>
					</Link>
				</CardDescription>
			</CardHeader>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="p-7">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											{...field}
											type="text"
											placeholder="Enter your name"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											{...field}
											type="email"
											placeholder="Enter email address"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											{...field}
											type="password"
											placeholder="Enter your password"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full" size="lg" disabled={isPending}>
							Register
						</Button>
					</form>
				</Form>
			</CardContent>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="p-7 flex flex-col gap-y-2">
				<Button
					disabled={isPending}
					variant="secondary"
					size="lg"
					className="w-full"
				>
					<FcGoogle className="size-5 mr-2" />
					Login with Google
				</Button>
				<Button
					disabled={isPending}
					variant="secondary"
					size="lg"
					className="w-full"
				>
					<FaGithub className="size-5 mr-2" />
					Login with Github
				</Button>
			</CardContent>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="p-7 flex items-center justify-center">
				<p>
					already have an account?
					<Link href="/sign-in">
						<span className="text-blue-700">&nbsp;Sign In</span>
					</Link>
				</p>
			</CardContent>
		</Card>
	);
};
