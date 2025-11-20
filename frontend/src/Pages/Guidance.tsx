import GridCard, { Grid } from "@/Components/ui/GridCard";
import GuidanceSettings from "./Guidance/GuidanceSettings";
import { useAuth } from "@/hooks/AuthContext";
import GuidanceAdd from "./Guidance/GuidanceAdd";
import GuidanceTable from "./Guidance/GuidanceTable";

const Guidance = () => {
	const { user } = useAuth();
	return (
		<Grid col={3} row={5}>
			<GridCard
				className="overflow-hidden"
				col={
					user?.userType === "admin" || user?.userType === "registrar" ? 2 : 3
				}
				row={2}
			>
				<GuidanceAdd />
			</GridCard>
			{user?.userType === "admin" || user?.userType === "registrar" ? (
				<GridCard className=" overflow-hidden " col={1} row={2}>
					<GuidanceSettings />
				</GridCard>
			) : null}
			<GridCard col={3} row={3}>
				<GuidanceTable />
			</GridCard>
		</Grid>
	);
};

export default Guidance;
