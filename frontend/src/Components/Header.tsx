import { CircleUser } from "lucide-react";

interface User {
	first_name?: string;
	last_name?: string;
	fullName: string;
}

const Header = ({ user }: { user: User }) => {
	const name =
		user?.first_name && user?.last_name
			? `${user.first_name} ${user.last_name}`
			: user?.fullName;
	return (
		<header
			className="flex w-full justify-end items-center px-6 py-4
			bg-gradient-to-r from-slate-850 to-slate-950
			shadow-lg border-b border-slate-900/20"
		>
			<div
				className="flex flex-row items-center gap-3 
				text-slate-50 hover:text-white
				transition-colors duration-200 cursor-pointer
				bg-slate-800/30 rounded-full px-4 py-2
				backdrop-blur-sm hover:bg-slate-800/50"
			>
				<span className="font-medium text-sm tracking-wide">{name}</span>
				<CircleUser className="h-8 w-8" />
			</div>
		</header>
	);
};

export default Header;
