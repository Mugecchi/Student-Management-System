const RunningBorder = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className="
				w-full h-full 
				rounded-2xl border border-transparent
				flex overflow-hidden
				[background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/0.48)_80%,theme(colors.cyan.500)_86%,theme(colors.cyan.300)_90%,theme(colors.cyan.500)_94%,theme(colors.slate.600/0.48))_border-box]
				animate-border
"
			style={
				{
					"--border-angle": "0deg",
				} as React.CSSProperties
			}
		>
			{children}
		</div>
	);
};

export default RunningBorder;
