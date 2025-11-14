/* eslint-disable react-hooks/exhaustive-deps */
import { useToast } from "@/hooks/ToastContext";
import { api } from "@/lib/axios";
import type { SubjectForm } from "@/types/enrollment";
import React from "react";

interface Props {
	refreshTrigger?: number;
}

const Subjects = ({ refreshTrigger }: Props) => {
	const [loading, setLoading] = React.useState(true);
	const [subjects, setSubjects] = React.useState<SubjectForm[]>([]);

	React.useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const res = await api.get("/registrar/subjects");
				setSubjects(res.data.subjects);
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
		fetchSubjects();
	}, [refreshTrigger]);
	const toast = useToast();

	return (
		<div className="flex flex-col rounded-2xl p-4">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr>
						<th>#</th>
						<th>Subject Code</th>
						<th>Subject Name</th>
						<th>Units</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<tr>
							<td colSpan={4}>Loading...</td>
						</tr>
					) : subjects?.length === 0 ? (
						<tr>
							<td colSpan={4}>No Subject found.</td>
						</tr>
					) : (
						subjects.map((e, i) => (
							<tr key={e.id}>
								<td>{i + 1}</td>
								<td>{e.subjectCode}</td>
								<td>{e.subjectName}</td>
								<td>{e.units}</td>
								<td>{e.description}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Subjects;
