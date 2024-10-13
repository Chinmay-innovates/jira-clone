import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export const TaskViewSwitcher = () => {
	return (
		<Tabs className="flex-1 w-full border rounded-lg">
			<div className="h-full flex flex-col overflow-auto p-4">
				<div className="flex  lg:flex-row gap-y-2 items-center justify-start w-full">
					<TabsList className="w-full lg:w-auto">
						<TabsTrigger className="h-8 w-full lg:w-auto" value="table">
							Table
						</TabsTrigger>
					</TabsList>
					<TabsList className="w-full lg:w-auto">
						<TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
							Kanban
						</TabsTrigger>
					</TabsList>
					<TabsList className="w-full lg:w-auto">
						<TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
							Calendar
						</TabsTrigger>
					</TabsList>
					<Button size="sm" className="w-full lg:w-auto">
						<Plus className="size-4 mr-2" />
						New
					</Button>
				</div>
				<DottedSeparator className="my-4" />
				Data Filters
				<DottedSeparator className="my-4" />
				<>
					<TabsContent value="table" className="mt-0">
						Data Table
					</TabsContent>
					<TabsContent value="kanban" className="mt-0">
						Data Kanban
					</TabsContent>
					<TabsContent value="calendar" className="mt-0">
						Data Calendar
					</TabsContent>
				</>
			</div>
		</Tabs>
	);
};
