"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type CreateWorkspaceSchema, createWorkspaceSchema } from "../schemas";

import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";

interface CreateWorkspaceFormProps {
	onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
	const { mutate, isPending } = useCreateWorkspace();
	const inputRef = useRef<HTMLInputElement>(null);
	const form = useForm<CreateWorkspaceSchema>({
		resolver: zodResolver(createWorkspaceSchema),
		defaultValues: {
			name: "",
			image: "",
		},
	});
	const onSumit = (values: CreateWorkspaceSchema) => {
		const finalValues = {
			...values,
			image: values.image instanceof File ? values.image : "",
		};
		mutate(
			{ form: values },
			{
				onSuccess: () => {
					form.reset();
				},
			}
		);
	};
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue("image", file);
		}
	};

	return (
		<Card className="size-full border-none shadow-none">
			<CardHeader className="flex p-7">
				<CardTitle className="text-xl font-bold">
					Create new workspace
				</CardTitle>
			</CardHeader>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="p-7">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSumit)}>
						<div className="flex flex-col gap-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Workspace name</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter workspace name" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<div className="flex flex-col gap-y-2">
										<div className="flex items-center gap-x-5">
											{field.value ? (
												<div className="size-[72px] relative rounded-md overflow-hidden">
													<Image
														fill
														src={
															field.value instanceof File
																? URL.createObjectURL(field.value)
																: field.value
														}
														alt="Workspace Icon"
														className="object-cover"
													/>
												</div>
											) : (
												<Avatar className="size-[72px]">
													<AvatarFallback>
														<ImageIcon className="size-[36px] text-neutral-400" />
													</AvatarFallback>
												</Avatar>
											)}
											<div className="flex flex-col">
												<p className="text-sm">Workspace Icon</p>
												<p className="text-sm text-muted-foreground">
													JPEG, PNG, SVG, or JPEG, max 1 mb
												</p>
												<input
													hidden
													type="file"
													ref={inputRef}
													disabled={isPending}
													onChange={handleImageChange}
													accept=".jpg, .jpeg, .png, .svg"
												/>
												<Button
													size="xs"
													type="button"
													variant="teritary"
													className="w-fit mt-2"
													disabled={isPending}
													onClick={() => inputRef.current?.click()}
												>
													Upload Icon
												</Button>
											</div>
										</div>
									</div>
								)}
							/>
						</div>
						<DottedSeparator className="py-7" />
						<div className="flex items-center justify-between">
							<Button
								type="button"
								size="lg"
								variant="secondary"
								onClick={onCancel}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button disabled={isPending} type="submit" size="lg">
								Create workspace
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
