import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const generateInviteCode = (length: number) => {
	const charecters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	let inviteCode = "";

	for (let i = 0; i < length; i++) {
		inviteCode += charecters.charAt(
			Math.floor(Math.random() * charecters.length)
		);
	}
	return inviteCode;
};

export const INVITECODE_LENGTH = 6;

export const snakeCaseToTitleCase = (str: string) => {
	return str
		.toLowerCase()
		.replace(/_/g, " ")
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
};
