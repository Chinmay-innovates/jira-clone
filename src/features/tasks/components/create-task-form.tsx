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
import { DatePicker } from "@/components/date-picker";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import {
	type CreateTaskSchema,
	createTaskSchema,
} from "@/features/tasks/schemas";

import { TaskStatus } from "../types";
import { useCreateTask } from "../api/use-create-task";

interface CreateTaskFormProps {
	onCancel?: () => void;
	projectOptions: {
		id: string;
		name: string;
		imageUrl: string;
	}[];
	memberOptions: {
		id: string;
		name: string;
	}[];
}

export const CreateTaskForm = ({
	onCancel,
	memberOptions,
	projectOptions,
}: CreateTaskFormProps) => {
	const workspaceId = useWorkspaceId();
	const { mutate, isPending } = useCreateTask();
	const form = useForm<CreateTaskSchema>({
		resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
		defaultValues: {
			workspaceId,
		},
	});
	const onSubmit = (values: CreateTaskSchema) => {
		mutate(
			{ json: { ...values, workspaceId } },
			{
				onSuccess: () => {
					form.reset();
					onCancel?.();
					// TODO: redirect to new task
				},
			}
		);
	};

	return (
		<Card className="size-full border-none shadow-none">
			<CardHeader className="flex p-7">
				<CardTitle className="text-xl font-bold">Create new task</CardTitle>
			</CardHeader>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="p-7">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Task name</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter task name" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Due Date</FormLabel>
										<FormControl>
											<DatePicker {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="assigneeId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Assignee</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select an assignee" />
												</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												{memberOptions.map((member) => (
													<SelectItem key={member.id} value={member.id}>
														<div className="flex items-center gap-x-2">
															<MemberAvatar
																className="size-6"
																name={member.name}
															/>
															{member.name}
														</div>
													</SelectItem>
												))}
												<FormMessage />
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select status" />
												</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												{Object.entries(TaskStatus).map(([key, value]) => (
													<SelectItem key={value} value={value.toUpperCase()}>
														{key
															.replace("_", " ")
															.toLowerCase()
															.replace(/\b\w/g, (char) => char.toUpperCase())}
													</SelectItem>
												))}
												<FormMessage />
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="projectId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Project</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a project" />
												</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												{projectOptions.map((project) => (
													<SelectItem key={project.id} value={project.id}>
														<div className="flex items-center gap-x-2">
															<ProjectAvatar
																image={project.imageUrl}
																className="size-6"
																name={project.name}
															/>
															{project.name}
														</div>
													</SelectItem>
												))}
												<FormMessage />
											</SelectContent>
										</Select>
									</FormItem>
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
								className={cn(!onCancel && "invisible")}
							>
								Cancel
							</Button>
							<Button disabled={isPending} type="submit" size="lg">
								Create Task
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
