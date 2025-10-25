/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "@/hooks/AuthContext";
import { api } from "@/lib/axios";
import React, { useState, useEffect } from "react";

type ScheduleCell = {
	value: string;
	teacher?: string;
	subject?: string;
};

type Subject = {
	_id: string;
	subjectName: string;
	subjectCode: string;
};

type Teacher = {
	_id: string;
	name: string;
};

type TeacherScheduleTableProps = {
	times: string[];
	teachers: Teacher[];
	subjects: Subject[];
	sections: string[];
	schedule: ScheduleCell[][];
};

const TeacherScheduleTable: React.FC<TeacherScheduleTableProps> = ({
	times = [],
	teachers = [],
	subjects = [],
	schedule: initialSchedule = [],
	sections = [],
}) => {
	// Defensive: always create a 2D array matching times x teachers
	const getSafeSchedule = () => {
		if (!Array.isArray(initialSchedule)) return [];
		return times.map((_, rowIdx) =>
			Array.isArray(initialSchedule[rowIdx])
				? teachers.map(
						(_, colIdx) => initialSchedule[rowIdx][colIdx] || { value: "" }
				  )
				: teachers.map(() => ({ value: "" }))
		);
	};
	const [schedule, setSchedule] = useState<ScheduleCell[][]>(getSafeSchedule());
	const [modal, setModal] = useState<{
		row: number;
		col: number;
		time: string;
		section?: string;
		open: boolean;
	}>({ row: -1, col: -1, time: "", open: false });
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("");
	// If times/teachers/initialSchedule change, update schedule
	const { user } = useAuth();
	useEffect(() => {
		setSchedule(getSafeSchedule());
	}, [times, teachers, initialSchedule]);

	if (
		!Array.isArray(times) ||
		!Array.isArray(teachers) ||
		!Array.isArray(subjects) ||
		!Array.isArray(schedule)
	) {
		return <div>Loading schedule...</div>;
	}

	const openModal = (
		row: number,
		col: number,
		time: string,
		section: string
	) => {
		setSelectedTeacher(schedule[row][col]?.teacher || "");
		setSelectedSubject(schedule[row][col]?.subject || "");
		setModal({ row, col, time, section, open: true });
	};
	console.log(modal);

	const closeModal = () =>
		setModal({ row: -1, col: -1, time: "", section: "", open: false });

	const handleAssign = async () => {
		const sectionId = sections[modal.col + 1]; // sections should be an array of section IDs

		const teacherId = selectedTeacher; // ObjectId string
		const subjectId = selectedSubject; // ObjectId string

		// You need to collect these from your modal or context
		const [startTime, endTime] = modal.time.split("-").map((t) => t.trim());

		const scheduleEntry = { startTime, endTime };

		const payload = {
			sectionId,
			subjectId,
			teacherId,
			schedule: [scheduleEntry],
			assignedBy: user?._id,
		};

		try {
			const response = await api.post("/schedule/add", payload);
			if (response.status === 201) {
				// Update your UI as before
				const newSchedule = schedule.map((rowArr, rowIdx) =>
					rowArr.map((cell, colIdx) =>
						rowIdx === modal.row && colIdx === modal.col
							? {
									...cell,
									value:
										teacherId && subjectId
											? `${
													teachers.find((t) => t._id === teacherId)?.name || ""
											  } - ${
													subjects.find((s) => s._id === subjectId)
														?.subjectName || ""
											  }`
											: "",
									teacher: teacherId,
									subject: subjectId,
							  }
							: cell
					)
				);
				setSchedule(newSchedule);
				closeModal();
			} else {
				alert(response.data.message || "Failed to assign schedule");
			}
		} catch (err) {
			let errorMsg = "Error assigning schedule: ";
			if (typeof err === "object" && err !== null) {
				if (
					"response" in err &&
					typeof (err as any).response === "object" &&
					(err as any).response !== null
				) {
					errorMsg +=
						(err as any).response?.data?.message ||
						(err as any).message ||
						"Unknown error";
				} else {
					errorMsg += (err as any).message || "Unknown error";
				}
			} else {
				errorMsg += String(err);
			}
			alert(errorMsg);
		}
	};

	return (
		<div className="overflow-auto w-full">
			<table className="min-w-max w-full border text-center">
				<thead>
					<tr>
						<th className="border px-2 py-1">TIME</th>
						{teachers.map((teacher) => (
							<th key={teacher._id} className="border px-2 py-1">
								{typeof teacher.name === "string"
									? teacher.name
									: JSON.stringify(teacher.name)}
							</th>
						))}
					</tr>
					<tr>
						{sections.map((section) => (
							<th key={section} className="border px-2 py-1">
								{section}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{times.map((time, rowIdx) => (
						<tr key={time}>
							<td className="border px-2 py-1 font-semibold">{time}</td>

							{teachers.map((_, colIdx) => (
								<td
									key={colIdx}
									className="border px-2 py-1 cursor-pointer hover:bg-blue-100"
									onClick={() =>
										openModal(rowIdx, colIdx, time, sections[colIdx + 1])
									}
								>
									{schedule[rowIdx] && schedule[rowIdx][colIdx]?.value}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			{/* Modal */}
			{modal.open && (
				<div className="fixed inset-0 backdrop-blur-md bg-opacity-30 flex items-center justify-center z-50">
					<div className="p-4 rounded-2xl bg-slate-950 shadow-md min-w-[300px]">
						<h2 className="mb-2 font-bold">Assign Teacher & Subject</h2>

						{/* Teacher select */}
						<div className="mb-2">
							<label className="block mb-1">Teacher:</label>
							<select
								className="border bg-slate-800 px-2 py-1 w-full"
								value={selectedTeacher}
								onChange={(e) => setSelectedTeacher(e.target.value)}
							>
								<option value="">Select Teacher</option>
								{teachers.map((t) => (
									<option key={t._id} value={t._id}>
										{t.name}
									</option>
								))}
							</select>
						</div>

						{/* Subject select */}
						<div className="mb-2">
							<label className="block mb-1">Subject:</label>
							<select
								className="border bg-slate-800 px-2 py-1 w-full"
								value={selectedSubject}
								onChange={(e) => setSelectedSubject(e.target.value)}
							>
								<option value="">Select Subject</option>
								{subjects.map((s) => (
									<option key={s._id} value={s._id}>
										{s.subjectName} ({s.subjectCode})
									</option>
								))}
							</select>
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
								disabled={!selectedTeacher || !selectedSubject}
							>
								Assign
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TeacherScheduleTable;
