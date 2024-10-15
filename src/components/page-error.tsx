import { AlertTriangle } from "lucide-react";

interface PageErrorProps {
	message?: string;
}
export const PageError = ({
	message = "Something went wrong",
}: PageErrorProps) => {
	return (
		<div className="flex items-center justify-center flex-col h-full">
			<AlertTriangle className="size-6 text-muted-foreground mb-2" />
			<p className="text-sm text-muted-foreground">{message}</p>
		</div>
	);
};
