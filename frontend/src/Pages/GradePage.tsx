import GridCard, { Grid } from "@/Components/ui/GridCard";
import AssignGrade from "./Grades/AssignGrade";

const GradePage = () => {
	return (
		<Grid>
			<GridCard>
				<AssignGrade />
			</GridCard>
		</Grid>
	);
};

export default GradePage;
