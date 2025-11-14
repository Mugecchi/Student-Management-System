import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { type EnrollmentData } from "@/types";
import { useAuth } from "@/hooks/AuthContext";
import { XCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/ToastContext";
import type { AxiosError } from "axios";

export const StudentTable = () => {
	const [students, setStudents] = useState<EnrollmentData[]>([]);
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const { refreshTrigger, refresh } = useAuth(); // to refresh on new enrollment
	const [form, setForm] = useState<{ sectionName: string }>({
		sectionName: "",
	});
	const [modal, setModal] = useState<{
		open: boolean;
		student?: EnrollmentData | null;
	}>({ open: false });
	const toast = useToast();
	const handleClose = () => setModal({ open: false, student: null });
	useEffect(() => {
		const fetchStudents = async () => {
			setLoading(true);
			try {
				const res = await api.get("/registrar/students", {
					params: { page, limit, search: query },
				});
				setStudents(res.data.students);
				setTotalPages(res.data.totalPages);
			} catch (err) {
				console.error("Error fetching students:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchStudents();
	}, [page, query, refreshTrigger, limit]);

	const handleSubmit = async () => {
		if (!modal.student?._id || !form.sectionName) {
			toast?.open({
				message: "Please select a student and section.",
				type: "error",
			});
			return;
		}
		try {
			await api.post("/section/add", {
				studentId: modal.student._id,
				sectionName: form.sectionName,
			});
			toast?.open({
				message: "Section assigned successfully!",
				type: "success",
			});
			handleClose();
			refresh();
		} catch (error) {
			console.error(error);
			const err = error as AxiosError<{ message?: string }>;
			toast?.open({
				message:
					err.response?.data.message ||
					"Failed to assign section. Please try again.",
				type: "error",
			});
		}
	};
	return (
		<div className="flex flex-col  rounded-2xl p-4 shadow-md h-full">
			{/* Search Bar */}
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-slate-700">Student List</h2>
				<input
					type="text"
					placeholder="Search students..."
					className="w-64 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setPage(1);
					}}
				/>
			</div>

			{/* Table */}
			<div className="overflow-auto rounded-lg border h-full">
				<table className="w-full text-left border-collapse">
					<thead className=" text-slate-600 uppercase text-sm font-semibold">
						<tr>
							<th className="py-3 px-4">#</th>
							<th className="py-3 px-4">First Name</th>
							<th className="py-3 px-4">Middle Name</th>
							<th className="py-3 px-4">Last Name</th>
							<th className="py-3 px-4">Username</th>
							<th className="py-3 px-4">Guardian Contact Number</th>
							<th className="py-3 px-4">Sections</th>
							<th className="py-3 px-4">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td
									colSpan={8}
									className="text-center py-6 text-slate-500 italic"
								>
									Loading students...
								</td>
							</tr>
						) : students.length === 0 ? (
							<tr>
								<td
									colSpan={8}
									className="text-center py-6 text-slate-500 italic"
								>
									No students found
								</td>
							</tr>
						) : (
							students.map((s, i) => (
								<tr key={s._id} className="  transition">
									<td className="py-2 px-4">{(page - 1) * limit + i + 1}</td>
									<td className="py-2 px-4">{s.first_name}</td>
									<td className="py-2 px-4">{s.middle_name}</td>
									<td className="py-2 px-4">{s.last_name}</td>
									<td className="py-2 px-4">{s.username}</td>
									<td className="py-2 px-4">{s.guardianContact}</td>
									<td
										className={`cursor-pointer ${
											s.sectionName ? "opacity-50 pointer-events-none" : ""
										}`}
										onClick={() => {
											if (!s.sectionName) setModal({ open: true, student: s });
										}}
									>
										{s.sectionName || (
											<span className="text-slate-400">No Section</span>
										)}
									</td>
									<td className="py-2 px-4">
										<button
											className="text-slate-600 hover:text-red-600 transition"
											onClick={async () => {
												if (
													window.confirm(
														`Are you sure you want to delete ${s.first_name} ${s.last_name}?`
													)
												) {
													try {
														await api.delete(`/registrar/students/${s._id}`);
														// optionally: refresh the list
														refresh();
													} catch (err) {
														console.error("Error deleting student:", err);
														alert(
															"Failed to delete student. Please try again."
														);
													}
												}
											}}
										>
											<XCircleIcon className="h-5 w-5" />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex justify-end items-center mt-4 gap-2">
				<button
					className="px-3 py-1 rounded-md border text-slate-700 disabled:opacity-50"
					onClick={() => setPage((p) => Math.max(p - 1, 1))}
					disabled={page === 1}
				>
					Prev
				</button>
				<span className="text-slate-600">
					Page {page} of {totalPages}
				</span>
				<button
					className="px-3 py-1 rounded-md border text-slate-700 disabled:opacity-50"
					onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
					disabled={page === totalPages}
				>
					Next
				</button>
			</div>
			{modal.open && (
				<div className="fixed inset-0 backdrop-blur-md   flex items-center justify-center z-50">
					<div className=" bg-slate-800 p-4 w-full max-w-2xl  rounded shadow-md flex flex-col gap-4">
						<h2 className="text-lg font-semibold mb-2">Student Details</h2>
						<p>
							Showing details for student: {modal.student?.first_name}{" "}
							{modal.student?.last_name}
						</p>
						<label className="block text-sm font-medium text-slate-300">
							Section:
						</label>

						<select
							onChange={(e) =>
								setForm({ ...form, sectionName: e.target.value })
							}
							className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 p-2 text-sm text-slate-300 placeholder:text-slate-500 focus:border-slate-500 focus:ring focus:ring-slate-500"
						>
							<option value="">Select Section</option>
							<option value="G1 - Genesis">G1 - Genesis</option>
							<option value="G2 - Kings">G2 - Kings</option>
							<option value="G2 - Leviticus">G2 - Leviticus</option>
							<option value="G3 - Joshua">G3 - Joshua</option>
							<option value="G4 - Chronicles">G4 - Chronicles</option>
							<option value="G5 - Ruth">G5 - Ruth</option>
							<option value="G6 - Samuel">G6 - Samuel</option>
							<option value="G7 - Corinthians">G7 - Corinthians</option>
							<option value="G8 - Romans">G8 - Romans</option>
							<option value="G9 - Galatians">G9 - Galatians</option>
						</select>
						<button className="btn" onClick={handleSubmit}>
							Assign Section
						</button>
						<button
							className="mt-4 px-3 py-1 rounded-md border text-slate-700"
							onClick={handleClose}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
