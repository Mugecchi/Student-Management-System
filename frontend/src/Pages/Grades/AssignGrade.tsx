/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type ReactNode } from "react";
import { api } from "@/lib/axios";
import { useAuth } from "@/hooks/AuthContext";
import GridCard, { Grid } from "@/Components/ui/GridCard";
import { useToast } from "@/hooks/ToastContext";

type Grade = {
	_id: string;
	studentId:
		| {
				_id: any;
				studentNumber: any;
				fullName?: string;
		  }
		| string;
	scheduleId:
		| {
				teacherId: any;
				subjectId: any;
				sectionId:
					| {
							_id: string;
							name: string;
					  }
					| string;
				schedule: any;
				_id?: string;
		  }
		| string;
	firstQuarterGrade?: string;
	secondQuarterGrade?: string;
	thirdQuarterGrade?: string;
	fourthQuarterGrade?: string;
	remarks?: string;
	enteredBy?:
		| {
				last_name: any;
				first_name: any;
				_id: string | undefined;
				fullName?: string;
		  }
		| string;
};

const inputClass =
	"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-800 text-white transition";
const labelClass = "block text-sm font-medium mb-1 text-gray-700 text-gray-300";
const btnClass =
	"w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition shadow";

const AssignGrade = () => {
	const { user } = useAuth();
	const [form, setForm] = useState({
		studentId: "",
		scheduleId: "",
		firstQuarterGrade: "",
		secondQuarterGrade: "",
		thirdQuarterGrade: "",
		fourthQuarterGrade: "",
		remarks: "",
		enteredBy: user?._id,
	});
	const toast = useToast();
	const [modal, setModal] = useState<{ open: boolean; studentId: string }>({
		open: false,
		studentId: "",
	});
	const [grades, setGrades] = useState<Grade[]>([]);
	const [students, setStudents] = useState<
		Array<{
			_id: string;
			first_name: string;
			last_name: string;
			username: string;
			sectionId?: string;
		}>
	>([]);
	const [schedules, setSchedules] = useState<
		Array<{
			schedule: any;
			_id: string;
			sectionId: {
				_id: string;
				name: string;
			};
			subjectId: {
				subjectCode: string;
				subjectName: ReactNode;
				_id: ReactNode;
				name: string;
			};
			teacherId: {
				_id: ReactNode;
				name: string;
			};
		}>
	>([]);
	const [selectedSchedule, setSelectedSchedule] = useState<string>("");

	useEffect(() => {
		api.get("/grade/all").then((res) => setGrades(res.data));
		api
			.get("/registrar/students", { params: { page: 1, limit: 100 } })
			.then((res) => setStudents(res.data.students));
		api.get("/schedule/get").then((res) => setSchedules(res.data));
	}, []);

	const handleChange = (e: { target: { name: string; value: string } }) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		try {
			const res = await api.post("/grade/assign", {
				...form,
				scheduleId: selectedSchedule || form.scheduleId,
				studentId: modal.studentId,
			});
			toast?.open({
				message: res.data.message || "Grade assigned!",
				type: "success",
			});
			const gradesRes = await api.get("/grade/all");
			setGrades(gradesRes.data.grades);
		} catch (err) {
			if (
				typeof err === "object" &&
				err !== null &&
				"response" in err &&
				typeof (err as { response?: unknown }).response === "object"
			) {
				const response = (err as { response?: { data?: { message?: string } } })
					.response;
				toast?.open({
					message: response?.data?.message || "Failed to assign grade.",
					type: "error",
				});
			} else {
				toast?.open({ message: "Failed to assign grade.", type: "error" });
			}
		}
	};

	return (
		<>
			<Grid col={2}>
				<GridCard col={1}>
					<h3 className="font-semibold text-2xl mt-4 text-slate-800">
						Assign Grades to student
					</h3>
					{/* Schedule/Section Filter */}
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1 text-gray-300">
							Filter by Schedule/Section
						</label>
						<select
							value={selectedSchedule}
							onChange={(e) => setSelectedSchedule(e.target.value)}
							className={inputClass}
						>
							<option value="">All Schedules/Sections</option>
							{schedules.map((s) => (
								<option key={s._id} value={s._id}>
									{typeof s.sectionId === "object" && s.sectionId !== null
										? s.sectionId.name
										: s.sectionId}
									{" - "}
									{s.subjectId?.subjectName ||
										s.subjectId?.name ||
										(typeof s.subjectId === "string" ? s.subjectId : "")}
									{" ("}
									{s.subjectId?.subjectCode || ""}
									{", "}
									{typeof s.teacherId === "object" && s.teacherId !== null
										? s.teacherId.name
										: s.teacherId}
									{", "}
									{s.schedule && s.schedule[0]
										? `${s.schedule[0].startTime}-${s.schedule[0].endTime}`
										: ""}
									{")"}
								</option>
							))}
						</select>
					</div>
					<div className="grid gap-4">
						{students
							.filter((s) => {
								if (!selectedSchedule) return true;
								// If student has sectionId, match with selected schedule's sectionId
								const schedule = schedules.find(
									(sc) => sc._id === selectedSchedule
								);
								if (!schedule) return true;
								// Assuming students have sectionId property
								return s.sectionId === schedule.sectionId._id;
							})
							.map((s) => (
								<div
									key={s._id}
									className="rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-3">
												<div>
													<span className="font-semibold">
														{s.first_name} {s.last_name}
													</span>
												</div>
											</div>
										</div>
										<button
											onClick={() => setModal({ open: true, studentId: s._id })}
											className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-1 px-2 rounded-lg transition"
										>
											Assign Grade
										</button>
									</div>
								</div>
							))}
					</div>
					{/* Modal for assigning grade */}
					{modal.open && (
						<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
							<div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative">
								<button
									className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
									onClick={() => setModal({ open: false, studentId: "" })}
								>
									&times;
								</button>
								<h2 className="text-xl font-bold mb-4 text-slate-700">
									Assign Grade
								</h2>
								{/* Show selected student info */}
								<div className="mb-4 text-lg font-semibold text-amber-700">
									{(() => {
										const selected = students.find(
											(s) => s._id === modal.studentId
										);
										return selected
											? `${selected.first_name} ${selected.last_name} (${selected.username})`
											: "Student not found";
									})()}
								</div>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										setForm((prev) => ({
											...prev,
											studentId: modal.studentId,
										}));
										handleSubmit(e);
										setModal({ open: false, studentId: "" });
									}}
									className="space-y-4"
								>
									<div>
										<label className={labelClass}>Schedule</label>
										<select
											name="scheduleId"
											value={selectedSchedule || form.scheduleId}
											onChange={handleChange}
											disabled
											className={inputClass}
										>
											<option value="">Select Schedule</option>
											{(schedules ?? []).map((s) => (
												<option key={s._id} value={s._id}>
													{typeof s.sectionId === "object" &&
													s.sectionId !== null
														? s.sectionId.name
														: s.sectionId}
													{" - "}
													{s.subjectId?.subjectName ||
														s.subjectId?.name ||
														(typeof s.subjectId === "string"
															? s.subjectId
															: "")}
													{" ("}
													{s.subjectId?.subjectCode || ""}
													{", "}
													{typeof s.teacherId === "object" &&
													s.teacherId !== null
														? s.teacherId.name
														: s.teacherId}
													{", "}
													{s.schedule && s.schedule[0]
														? `${s.schedule[0].startTime}-${s.schedule[0].endTime}`
														: ""}
													{")"}
												</option>
											))}
										</select>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className={labelClass}>1st Quarter</label>
											<input
												name="firstQuarterGrade"
												placeholder="1st Quarter"
												value={form.firstQuarterGrade}
												onChange={handleChange}
												className={inputClass}
											/>
										</div>
										<div>
											<label className={labelClass}>2nd Quarter</label>
											<input
												name="secondQuarterGrade"
												placeholder="2nd Quarter"
												value={form.secondQuarterGrade}
												onChange={handleChange}
												className={inputClass}
											/>
										</div>
										<div>
											<label className={labelClass}>3rd Quarter</label>
											<input
												name="thirdQuarterGrade"
												placeholder="3rd Quarter"
												value={form.thirdQuarterGrade}
												onChange={handleChange}
												className={inputClass}
											/>
										</div>
										<div>
											<label className={labelClass}>4th Quarter</label>
											<input
												name="fourthQuarterGrade"
												placeholder="4th Quarter"
												value={form.fourthQuarterGrade}
												onChange={handleChange}
												className={inputClass}
											/>
										</div>
									</div>
									<div>
										<label className={labelClass}>Remarks</label>
										<input
											name="remarks"
											placeholder="Remarks"
											value={form.remarks}
											onChange={handleChange}
											className={inputClass}
										/>
									</div>
									<button type="submit" className={btnClass}>
										Assign Grade
									</button>
								</form>
							</div>
						</div>
					)}
				</GridCard>

				<GridCard>
					<h3 className="mt-4 text-xl font-bold text-gray-200">Grades List</h3>
					<div className="overflow-x-auto mt-2 rounded-lg shadow">
						<div className="flex justify-end mb-2">
							<button
								type="button"
								className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-1 px-4 rounded-lg transition shadow"
								onClick={() => {
									const printContent = document.getElementById("grades-table");
									if (printContent) {
										const printWindow = window.open("", "width=900,height=600");
										if (printWindow) {
											printWindow.document.write(`
											<html>
												<head>
													<title>Print Grades List</title>
													<style>
														body { font-family: Arial, sans-serif; padding: 20px; }
														table { width: 100%; border-collapse: collapse; }
														th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
														th { background: #FFD580; }
													</style>
												</head>
												<body>
													${printContent.innerHTML}
												</body>
											</html>
										`);
											printWindow.document.close();
											printWindow.focus();
											printWindow.print();
										}
									}
								}}
							>
								Print Grades List
							</button>
						</div>
						<div id="grades-table">
							<table className="min-w-full bg-gray-800 border border-gray-700">
								<thead>
									<tr className="bg-amber-900">
										<th className="py-2 px-3 text-left">Student</th>
										<th className="py-2 px-3 text-left">Schedule</th>
										<th className="py-2 px-3 text-center">1st Qtr</th>
										<th className="py-2 px-3 text-center">2nd Qtr</th>
										<th className="py-2 px-3 text-center">3rd Qtr</th>
										<th className="py-2 px-3 text-center">4th Qtr</th>
										<th className="py-2 px-3 text-center">Remarks</th>
										<th className="py-2 px-3 text-left">Entered By</th>
									</tr>
								</thead>
								<tbody>
									{(grades ?? []).map((g) => (
										<tr
											key={g._id}
											className="border-t border-gray-700 hover:bg-gray-900 transition"
										>
											<td className="py-2 px-3">
												{typeof g.studentId === "object" && g.studentId !== null
													? g.studentId.studentNumber || g.studentId._id
													: g.studentId}
											</td>
											<td className="py-2 px-3">
												{typeof g.scheduleId === "object" &&
												g.scheduleId !== null
													? `${
															typeof g.scheduleId.sectionId === "object"
																? g.scheduleId.sectionId.name
																: g.scheduleId.sectionId || ""
													  } - ${
															g.scheduleId.subjectId?.subjectName ||
															g.scheduleId.subjectId?.name ||
															(typeof g.scheduleId.subjectId === "string"
																? g.scheduleId.subjectId
																: "")
													  }`
													: g.scheduleId}
											</td>
											<td className="py-2 px-3 text-center">
												{g.firstQuarterGrade}
											</td>
											<td className="py-2 px-3 text-center">
												{g.secondQuarterGrade}
											</td>
											<td className="py-2 px-3 text-center">
												{g.thirdQuarterGrade}
											</td>
											<td className="py-2 px-3 text-center">
												{g.fourthQuarterGrade}
											</td>
											<td className="py-2 px-3 text-center">{g.remarks}</td>
											<td className="py-2 px-3">
												{typeof g.enteredBy === "object" && g.enteredBy !== null
													? (g.enteredBy._id &&
															`${g.enteredBy.first_name} ${g.enteredBy.last_name}`) ||
													  g.enteredBy._id
													: g.enteredBy}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</GridCard>
			</Grid>
		</>
	);
};

export default AssignGrade;
