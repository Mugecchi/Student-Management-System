import AcademicYear from "./Settings/AcademicYear";
import { api } from "@/lib/axios";
import type { AcademicYearForm } from "@/types/enrollment";
import Button from "@/Components/ui/Button";
import { useToast } from "@/hooks/ToastContext";
import React from "react";
import AcadYearTable from "./Settings/AcadYearTable";
import type { AxiosError } from "node_modules/axios/index.d.cts";
import GridCard from "@/Components/ui/GridCard";

const Settings = () => {
	const toast = useToast();
	const [refreshTrigger, setRefreshTrigger] = React.useState<number>();
	const handleAcademicSubmit = async (formData: AcademicYearForm) => {
		try {
			await api.post("/registrar/academic-year", formData);
			setRefreshTrigger(Date.now());

			toast?.open({
				message: "Academic year saved successfully!",
				type: "success",
			});
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
		<div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full overflow-auto">
			<GridCard col={1} row={1}>
				<AcademicYear onSubmit={handleAcademicSubmit} />
				<Button className="mt-6" form="academic-year-form" type="submit">
					Submit Academic Year
				</Button>
			</GridCard>

			<GridCard col={1} row={3} className="row-start-2">
				<AcadYearTable refreshTrigger={refreshTrigger} />
			</GridCard>
		</div>
	);
};

export default Settings;
