import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { type EnrollmentData } from "@/types";
import { useAuth } from "@/hooks/AuthContext";
import { XCircleIcon } from "lucide-react";

export const StudentTable = () => {
	const [students, setStudents] = useState<EnrollmentData[]>([]);
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const { refreshTrigger, refresh } = useAuth(); // to refresh on new enrollment
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
		</div>
	);
};
