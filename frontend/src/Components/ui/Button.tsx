import { useRef } from "react";

interface ButtonProps {
	children?: React.ReactNode;
	className?: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	[key: string]: unknown;
}

const Button = ({
	children,
	className = "",
	onClick,
	...props
}: ButtonProps) => {
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
		const button = buttonRef.current;
		if (!button) return;

		const circle = document.createElement("span");
		const diameter = Math.max(button.clientWidth, button.clientHeight);
		const radius = diameter / 2;

		const rect = button.getBoundingClientRect();
		const x = event.clientX - rect.left - radius;
		const y = event.clientY - rect.top - radius;

		circle.style.width = circle.style.height = `${diameter}px`;
		circle.style.left = `${x}px`;
		circle.style.top = `${y}px`;
		circle.classList.add("ripple");

		const existing = button.getElementsByClassName("ripple")[0];
		if (existing) existing.remove();

		button.appendChild(circle);

		if (onClick) onClick(event);
	};

	return (
		<button
			{...props}
			ref={buttonRef}
			onClick={createRipple}
			className={`btn relative overflow-hidden ${className}`}
		>
			{children}
		</button>
	);
};

export default Button;
