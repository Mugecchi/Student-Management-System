import GridCard, { Grid } from "@/Components/ui/GridCard";
import { useToast } from "@/hooks/ToastContext";
import { api } from "@/lib/axios";
import type { SubjectForm } from "@/types/enrollment";
import type { AxiosError } from "node_modules/axios/index.d.cts";
import React from "react";
import Subjects from "./Settings/Subjects";
import Button from "@/Components/ui/Button";
import AddSubject from "./Settings/AddSubject";

const SubjectsPage = () => {
	const toast = useToast();
	const [subjectRefresh, setSubjectRefresh] = React.useState<number>();
	const handleAddSubject = async (formData: SubjectForm) => {
		try {
			await api.post("/registrar/add-subject", formData);
			toast?.open({
				message: "Subject added successfully!",
				type: "success",
			});
			setSubjectRefresh(Date.now());
		} catch (error) {
			const err = error as AxiosError<{ message?: string }>;
			const message =
				err.response?.data?.message || "An unexpected error occurred";

			toast?.open({
				message,
				type: "error",
			});
		}
	};

	return (
		<Grid col={1} row={5}>
			<GridCard col={1} row={2}>
				<AddSubject onSubmit={handleAddSubject} />
				<Button className="mt-6" form="subject-addition-form" type="submit">
					Add Subject
				</Button>
			</GridCard>
			<GridCard col={1} row={3}>
				<Subjects refreshTrigger={subjectRefresh} />
			</GridCard>
		</Grid>
	);
};

export default SubjectsPage;
