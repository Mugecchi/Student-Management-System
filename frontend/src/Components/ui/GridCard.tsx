import Card from "./Card";

interface Props {
	row?: number;
	col?: number;
	children?: React.ReactNode;
	className?: string;
}
const GridCard = ({ col = 1, row = 1, children, className = "" }: Props) => {
	const colClasses: Record<number, string> = {
		1: "col-span-1",
		2: "col-span-2",
		3: "col-span-3",
		4: "col-span-4",
		5: "col-span-5",
		6: "col-span-6",
	};

	const rowClasses: Record<number, string> = {
		1: "row-span-1",
		2: "row-span-2",
		3: "row-span-3",
		4: "row-span-4",
		5: "row-span-5",
	};

	return (
		<div
			className={`${colClasses[col] || ""} ${
				rowClasses[row] || ""
			} ${className}`}
		>
			<Card>{children}</Card>
		</div>
	);
};
export const Grid = ({ col = 1, row = 1, children }: Props) => {
	const colClasses: Record<number, string> = {
		1: "grid-cols-1",
		2: "grid-cols-2",
		3: "grid-cols-3",
		4: "grid-cols-4",
		5: "grid-cols-5",
		6: "grid-cols-6",
		7: "grid-cols-8",
		8: "grid-cols-7",
		9: "grid-cols-9",
		10: "grid-cols-10",
		11: "grid-cols-11",
		12: "grid-cols-12",
		13: "grid-cols-13",
		14: "grid-cols-14",
		15: "grid-cols-15",
	};
	const rowClasses: Record<number, string> = {
		1: "grid-rows-1",
		2: "grid-rows-2",
		3: "grid-rows-3",
		4: "grid-rows-4",
		5: "grid-rows-5",
		6: "grid-rows-6",
		7: "grid-rows-8",
		8: "grid-rows-7",
		9: "grid-rows-9",
		10: "grid-rows-10",
		11: "grid-rows-11",
		12: "grid-rows-12",
		13: "grid-rows-13",
		14: "grid-rows-14",
		15: "grid-rows-15",
	};
	return (
		<div
			className={`grid ${colClasses[col] || ""} ${rowClasses[row] || ""} gap-2
			h-full
			w-full
			overflow-auto`}
		>
			{children}
		</div>
	);
};
export default GridCard;
