/* eslint-disable react-hooks/exhaustive-deps */
import { useToast } from "@/hooks/ToastContext";
import { api } from "@/lib/axios";
import type { AcademicYearForm } from "@/types/enrollment";
import React from "react";

interface Props {
	refreshTrigger?: number;
}

const AcadYearTable = ({ refreshTrigger }: Props) => {
	const [loading, setLoading] = React.useState(true);
	const [acadYears, setAcadYears] = React.useState<AcademicYearForm[]>([]);
	const toast = useToast();

	React.useEffect(() => {
		const fetchAcadYears = async () => {
			try {
				const res = await api.get("/registrar/academic-years");
				setAcadYears(res.data.academicYears);
				setLoading(false);
			} catch (error) {
				toast?.open({
					message:
						error instanceof Error
							? error.message
							: "An unexpected error occurred",
					type: "error",
				});
			}
		};
		fetchAcadYears();
	}, [refreshTrigger]);

	return (
		<div className="flex flex-col rounded-2xl p-4">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr>
						<th>#</th>
						<th>Start Date</th>
						<th>End Date</th>
						<th>Semester</th>
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<tr>
							<td colSpan={4}>Loading...</td>
						</tr>
					) : acadYears.length === 0 ? (
						<tr>
							<td colSpan={4}>No academic years found.</td>
						</tr>
					) : (
						acadYears.map((year: AcademicYearForm, i: number) => (
							<tr className={year.isCurrent ? "bg-cyan-950" : ""} key={i}>
								<td>{i + 1}</td>
								<td>{year.startDate ? year.startDate.split("T")[0] : ""}</td>
								<td>{year.endDate ? year.endDate.split("T")[0] : ""}</td>
								<td>{year.semester}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default AcadYearTable;
