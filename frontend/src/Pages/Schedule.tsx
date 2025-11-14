/* eslint-disable @typescript-eslint/no-explicit-any */
import GridCard, { Grid } from "@/Components/ui/GridCard";
import { useToast } from "@/hooks/ToastContext";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

const times = [
	"07:15-07:45",
	"07:45-08:25",
	"08:25-09:10",
	"09:10-09:25",
	"09:25-10:10",
	"10:10-10:55",
	"10:55-11:40",
	"11:40-01:00",
	"01:00-01:45",
	"01:45-02:30",
	"02:30-02:45",
	"02:45-03:30",
	"03:30-04:15",
	"04:15-04:30",
];

const sections = [
	"G1 - Genesis",
	"G2 - Kings",
	"G2 - Leviticus",
	"G3 - Joshua",
	"G4 -Chronicles",
	"G5 - Ruth",
	"G6 - Samuel",
	"G7 - Corinthians",
	"G8 - Romans",
	"G9 - Galatians",
];

const Schedule = () => {
	const [schedule, setSchedule] = useState<any[]>([]);
	const [teachers, setTeachers] = useState<any[]>([]);
	const [subjects, setSubjects] = useState<any[]>([]);
	const [modal, setModal] = useState<{
		time: string;
		section?: string;
		open: boolean;
	}>({ time: "", open: false });
	const [form, setForm] = useState<{
		teacherId: string;
		time: string;
		subjectId?: string;
	}>({ teacherId: "", time: "", subjectId: "" });

	useEffect(() => {
		const fetchSchedule = async () => {
			try {
				const response = await api.get("/schedule/get");
				setSchedule(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		const fetchTeachers = async () => {
			try {
				const response = await api.get("/schedule/teachers");
				setTeachers(response.data.teachers);
			} catch (error) {
				console.log(error);
			}
		};
		const fetchSubjects = async () => {
			try {
				const response = await api.get("/registrar/subjects");
				setSubjects(response.data.subjects);
			} catch (error) {
				console.log(error);
			}
		};
		fetchTeachers();
		fetchSubjects();
		fetchSchedule();
	}, []);

	const toast = useToast();
	// Helper to get schedule for a section and time
	const getCell = (section: string, time: string) => {
		const entry = schedule.find(
			(item) =>
				item.sectionId === section &&
				item.schedule.some((s: any) => `${s.startTime}-${s.endTime}` === time)
		);
		if (!entry) return null;

		const subject =
			typeof entry.subjectId === "object"
				? entry.subjectId?.subjectName ||
				  entry.subjectId?.subjectCode ||
				  "Unknown Subject"
				: entry.subjectId;

		const teacher =
			typeof entry.teacherId === "object"
				? entry.teacherId?.first_name && entry.teacherId?.last_name
					? `${entry.teacherId.first_name} ${entry.teacherId.last_name}`
					: "Unknown Teacher"
				: entry.teacherId;

		const teacherId =
			typeof entry.teacherId === "object"
				? entry.teacherId?._id
				: entry.teacherId;
		const hashCode = teacherId
			? teacherId
					.toString()
					.split("")
					.reduce((a: number, b: string) => {
						a = (a << 5) - a + b.charCodeAt(0);
						return a & a;
					}, 0)
			: 0;
		const hue = Math.abs(hashCode) % 360;
		const backgroundColor = `hsl(${hue}, 70%, 85%)`;
		const borderColor = `hsl(${hue}, 70%, 60%)`;

		return (
			<div
				style={{
					backgroundColor,
					border: `2px solid ${borderColor}`,
					borderRadius: "4px",
					padding: "4px",
				}}
			>
				<div style={{ fontWeight: "bold", color: "#333" }}>{subject}</div>
				<div style={{ fontSize: "0.8em", color: "#333" }}>{teacher}</div>
			</div>
		);
	};
	const openModal = (time: string, section: string) => {
		setModal({ time, section, open: true });
	};

	const closeModal = () => {
		setModal({ time: "", section: "", open: false });
		setForm({ teacherId: "", time: "" });
	};

	const handleAssign = async () => {
		const [startTime, endTime] = modal.time.split("-").map((t) => t.trim());
		const scheduleEntry = { startTime, endTime };
		const payload = {
			teacherId: form.teacherId,
			sectionId: modal.section || "",
			subjectId: form.subjectId || "",
			schedule: [scheduleEntry],
		};

		try {
			const response = await api.post("/schedule/add", payload);
			if (response.status === 201) {
				closeModal();
				toast?.open({
					type: "success",
					message: "Schedule assigned successfully.",
				});
			}
		} catch (error) {
			console.log(error);
			toast?.open({
				type: "error",
				message: `Failed to assign schedule: ${error}`,
			});
		}
	};

	return (
		<Grid>
			<GridCard>
				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr>
							<th>Time</th>
							{sections.map((section) => (
								<th key={section}>{section}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{times.map((time) => (
							<tr key={time}>
								<td>{time}</td>
								{sections.map((section) => (
									<td
										key={section}
										style={{
											border: "1px solid #ddd",
											minWidth: "120px",
											cursor: "pointer",
											transition: "background 0.2s",
										}}
										onMouseEnter={(e) =>
											(e.currentTarget.style.backgroundColor = "#e6f7ff")
										}
										onMouseLeave={(e) =>
											(e.currentTarget.style.backgroundColor = "inherit")
										}
										onClick={() => openModal(time, section)}
									>
										{getCell(section, time)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</GridCard>
			{modal.open && (
				<div className="fixed inset-0 backdrop-blur-md bg-opacity-30 flex items-center justify-center z-50">
					<div className="p-4 rounded-2xl bg-slate-950 shadow-md min-w-[300px]">
						<h2 className="mb-2 font-bold">Assign Teacher & Subject</h2>

						{/* Teacher select */}
						<div className="mb-2">
							<label className="block mb-1">Teacher:</label>

							<select
								value={form.teacherId}
								onChange={(e) =>
									setForm({ ...form, teacherId: e.target.value })
								}
								className="border bg-slate-800 px-2 py-1 w-full"
							>
								<option value="">Select Teacher</option>
								{teachers.map((t) => (
									<option key={t._id} value={t._id}>
										{t.first_name} {t.last_name}
									</option>
								))}
							</select>
						</div>

						{/* Subject select */}
						<div className="mb-2">
							<label className="block mb-1">Subject:</label>
							<select
								value={form.subjectId}
								onChange={(e) =>
									setForm({ ...form, subjectId: e.target.value })
								}
								className="border bg-slate-800 px-2 py-1 w-full"
							>
								<option value="">Select Subject</option>
								{subjects.map((s) => (
									<option key={s._id} value={s._id}>
										{s.subjectName} ({s.subjectCode})
									</option>
								))}
							</select>
						</div>
						<div className="mb-2">
							<label className="block mb-1">Section</label>
							<input
								className="w-full border bg-slate-800 px-2 py-1"
								disabled
								value={modal.section}
							/>
						</div>
						<div className="mb-2">
							<label className="block mb-1">Time</label>
							<input
								className="w-full border bg-slate-800 px-2 py-1"
								disabled
								value={modal.time}
							/>
						</div>
						{/* Action buttons */}
						<div className="flex justify-end gap-2">
							<button
								className="px-3 py-1 bg-gray-300 rounded"
								onClick={closeModal}
							>
								Cancel
							</button>
							<button
								className="px-3 py-1 bg-blue-500 text-white rounded"
								onClick={handleAssign}
							>
								Assign
							</button>
						</div>
					</div>
				</div>
			)}
		</Grid>
	);
};

export default Schedule;
