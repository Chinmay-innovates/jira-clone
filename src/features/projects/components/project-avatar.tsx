import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProjectAvatarProps {
	image?: string;
	name: string;
	className?: string;
	fallbackClassName?: string;
}

export const ProjectAvatar = ({
	name,
	image,
	className,
	fallbackClassName,
}: ProjectAvatarProps) => {
	if (image) {
		return (
			<div
				className={cn("size-5 relative rounded-md overflow-hidden", className)}
			>
				<Image src={image} alt={name} fill className="object-cover" />
			</div>
		);
	}
	return (
		<Avatar className={cn("size-5 rounded-md", className)}>
			<AvatarFallback
				className={cn(
					"text-white bg-blue-600 font-semibold text-sm uppercase rounded-md",
					fallbackClassName
				)}
			>
				{name[0]}
			</AvatarFallback>
		</Avatar>
	);
};
