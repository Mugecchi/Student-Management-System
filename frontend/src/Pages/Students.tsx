import StudentEnrollmentForm from "@/Components/StudentEnrollmentForm";
import { StudentTable } from "@/Components/StudentTable";
import Card from "@/Components/ui/Card";

const Students = () => {
	return (
		<div className="w-full h-full justify-center  grid grid-cols-1   gap-2">
			<div className="col-span-1">
				<Card>
					<StudentEnrollmentForm />
				</Card>
			</div>
			<div className="col-span-1 ">
				<Card>
					<StudentTable />
				</Card>
			</div>
		</div>
	);
};

export default Students;
