import React from "react";
import RunningBorder from "./RunningBorder";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

/**
 * Card Component
 * - Keeps consistent default styling.
 * - Allows adding or overriding styles via `className`.
 * - Supports all valid div props.
 */
const Card: React.FC<Props> = ({ children, className = "", ...props }) => {
	const baseStyles = `
		flex w-full flex-col flex-1 transition duration-300 p-4 shadow-sm hover:shadow-xl
		rounded-2xl border 
		bg-slate-900/50 border-slate-700
		h-full overflow-auto
	`;

	return (
		<div className="w-full h-full max-w-full flex-1">
			<RunningBorder>
				<div {...props} className={`${baseStyles} ${className}`.trim()}>
					{children}
				</div>
			</RunningBorder>
		</div>
	);
};

export default Card;
