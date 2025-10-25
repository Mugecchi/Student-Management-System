/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type ReactNode } from "react";
import { api } from "@/lib/axios";
import { useAuth } from "@/hooks/AuthContext";
import GridCard, { Grid } from "@/Components/ui/GridCard";

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
	prelimGrade?: string;
	midtermGrade?: string;
	finalsGrade?: string;
	finalGrade?: string;
	remarks?: string;
	enteredBy?:
		| {
				_id: string | undefined;
				fullName?: string;
		  }
		| string;
};

const inputClass =
	"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition";
const labelClass =
	"block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";
const btnClass =
	"w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition shadow";

const AssignGrade = () => {
	const { user } = useAuth();
	const [form, setForm] = useState({
		studentId: "",
		scheduleId: "",
		prelimGrade: "",
		midtermGrade: "",
		finalsGrade: "",
		finalGrade: "",
		remarks: "",
		enteredBy: user?._id,
	});
	const [grades, setGrades] = useState<Grade[]>([]);
	const [students, setStudents] = useState<
		Array<{
			_id: string;
			first_name: string;
			last_name: string;
			username: string;
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
	const [message, setMessage] = useState("");

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
		setMessage("");
		try {
			const res = await api.post("/grade/assign", form);
			setMessage(res.data.message || "Grade assigned!");
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
				setMessage(response?.data?.message || "Failed to assign grade.");
			} else {
				setMessage("Failed to assign grade.");
			}
		}
	};

	return (
		<Grid col={2}>
			<GridCard col={1}>
				<h2 className="text-2xl font-bold mb-4 text-slate-600 ">
					Assign Grade
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className={labelClass}>Student</label>
						<select
							name="studentId"
							value={form.studentId}
							onChange={handleChange}
							required
							className={inputClass}
						>
							<option value="">Select Student</option>
							{students.map((s) => (
								<option key={s._id} value={s._id}>
									{s.first_name} {s.last_name} ({s.username})
								</option>
							))}
						</select>
					</div>
					<div>
						<label className={labelClass}>Schedule</label>
						<select
							name="scheduleId"
							value={form.scheduleId}
							onChange={handleChange}
							required
							className={inputClass}
						>
							<option value="">Select Schedule</option>
							{(schedules ?? []).map((s) => (
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
					<div className="grid grid-cols-3 gap-4">
						<div>
							<label className={labelClass}>Prelim</label>
							<input
								name="prelimGrade"
								placeholder="Prelim"
								value={form.prelimGrade}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Midterm</label>
							<input
								name="midtermGrade"
								placeholder="Midterm"
								value={form.midtermGrade}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Finals</label>
							<input
								name="finalsGrade"
								placeholder="Finals"
								value={form.finalsGrade}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
					</div>
					<div>
						<label className={labelClass}>Final Grade</label>
						<input
							name="finalGrade"
							placeholder="Final Grade"
							value={form.finalGrade}
							onChange={handleChange}
							className={inputClass}
						/>
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
			</GridCard>
			{message && (
				<div className="mt-4 text-center text-slate-600  font-semibold">
					{message}
				</div>
			)}
			<GridCard>
				<h3 className="mt-8 text-xl font-bold text-gray-800 dark:text-gray-200">
					Grades List
				</h3>
				<div className="overflow-x-auto mt-2 rounded-lg shadow">
					<table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
						<thead>
							<tr className="bg-amber-100 dark:bg-amber-900">
								<th className="py-2 px-3 text-left">Student</th>
								<th className="py-2 px-3 text-left">Schedule</th>
								<th className="py-2 px-3 text-center">Prelim</th>
								<th className="py-2 px-3 text-center">Midterm</th>
								<th className="py-2 px-3 text-center">Finals</th>
								<th className="py-2 px-3 text-center">Final</th>
								<th className="py-2 px-3 text-center">Remarks</th>
								<th className="py-2 px-3 text-left">Entered By</th>
							</tr>
						</thead>
						<tbody>
							{(grades ?? []).map((g) => (
								<tr
									key={g._id}
									className="border-t border-gray-200 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-gray-900 transition"
								>
									<td className="py-2 px-3">
										{typeof g.studentId === "object" && g.studentId !== null
											? g.studentId.studentNumber || g.studentId._id
											: g.studentId}
									</td>
									<td className="py-2 px-3">
										{typeof g.scheduleId === "object" && g.scheduleId !== null
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
											  } (${g.scheduleId.subjectId?.subjectCode || ""}, ${
													typeof g.scheduleId.teacherId === "object"
														? g.scheduleId.teacherId.name
														: g.scheduleId.teacherId || ""
											  }, ${
													g.scheduleId.schedule && g.scheduleId.schedule[0]
														? `${g.scheduleId.schedule[0].startTime}-${g.scheduleId.schedule[0].endTime}`
														: ""
											  })`
											: g.scheduleId}
									</td>
									<td className="py-2 px-3 text-center">{g.prelimGrade}</td>
									<td className="py-2 px-3 text-center">{g.midtermGrade}</td>
									<td className="py-2 px-3 text-center">{g.finalsGrade}</td>
									<td className="py-2 px-3 text-center">{g.finalGrade}</td>
									<td className="py-2 px-3 text-center">{g.remarks}</td>
									<td className="py-2 px-3">
										{typeof g.enteredBy === "object" && g.enteredBy !== null
											? g.enteredBy.fullName || g.enteredBy._id
											: g.enteredBy}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</GridCard>
		</Grid>
	);
};

export default AssignGrade;
