import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import { enUS } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Task } from "../types";
import {
	addMonths,
	format,
	getDay,
	parse,
	startOfWeek,
	subMonths,
} from "date-fns";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";
import { EventCard } from "./event-card";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const locales = {
	"en-US": enUS,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});
interface DataCalendarProps {
	data: Task[];
}

interface CustomToolbarProps {
	onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
	date: Date;
}
const CustomToolbar = ({ onNavigate, date }: CustomToolbarProps) => {
	return (
		<div className="flex bg-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
			<Button
				onClick={() => onNavigate("PREV")}
				variant="secondary"
				size="icon"
			>
				<ChevronLeft className="size-4" />
			</Button>
			<div className="flex items-center border border-input rounded-md px-3 py-2 h-8 w-full  lg:w-auto">
				<CalendarIcon className="size-4 mr-2" />
				<p className="text-sm">{format(date, "MMMM yyyy")}</p>
			</div>
			<Button
				onClick={() => onNavigate("NEXT")}
				variant="secondary"
				size="icon"
			>
				<ChevronRight className="size-4" />
			</Button>
		</div>
	);
};

export const DataCalander = ({ data }: DataCalendarProps) => {
	const [value, setValue] = useState(
		data.length > 0 ? new Date(data[0].dueDate) : new Date()
	);

	const events = data.map((task: Task) => ({
		start: new Date(task.dueDate),
		end: new Date(task.dueDate),
		title: task.name,
		project: task.project,
		assignee: task.assignee,
		status: task.status,
		id: task.$id,
	}));

	const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
		setValue(
			action === "PREV"
				? subMonths(value, 1)
				: action === "NEXT"
				? addMonths(value, 1)
				: new Date()
		);
	};
	return (
		<Calendar
			localizer={localizer}
			date={value}
			events={events}
			views={["month"]}
			defaultView="month"
			toolbar={true}
			showAllEvents={true}
			className="h-full"
			max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
			formats={{
				weekdayFormat: (date, culture, localizer) =>
					localizer?.format(date, "EEE", culture) ?? "",
			}}
			components={{
				eventWrapper: ({ event }) => (
					<EventCard
						id={event.id}
						title={event.title}
						project={event.project}
						assignee={event.assignee}
						status={event.status}
					/>
				),
				toolbar: () => (
					<CustomToolbar onNavigate={handleNavigate} date={value} />
				),
			}}
		/>
	);
};
