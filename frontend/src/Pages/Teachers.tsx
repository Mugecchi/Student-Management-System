/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import TeacherScheduleTable from "@/Components/TeacherScheduleTable";
import GridCard, { Grid } from "@/Components/ui/GridCard";

const times = [
	"7:15-7:45",
	"7:45-8:25",
	"8:25-9:10",
	"9:10-9:25",
	"9:25-10:10",
	"10:10-10:55",
	"10:55-11:40",
	"11:40-1:00",
	"1:00-1:45",
	"1:45-2:30",
	"2:30-2:45",
	"2:45-3:30",
	"3:30-4:15",
	"4:15-4:30",
];

const sections = [
	"",
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

const Teachers = () => {
	const [teachers, setTeachers] = useState<any[]>([]); // Array of teacher objects
	const [subjects, setSubjects] = useState<any[]>([]); // Array of subject objects
	const [schedule, setSchedule] = useState<any[][]>([]); // 2D array

	useEffect(() => {
		// Fetch teachers
		api.get("/schedule/teachers").then((res) => {
			setTeachers(
				res.data.teachers.map((t: any, i: number) => ({
					_id: t._id,
					name: t.fullName || t.username || t._id,
					color: `hsl(${(i * 137.508) % 360}, 70%, 60%)`,
				}))
			);
		});
		// Fetch subjects
		const getSubjects = async () => {
			const res = await api.get("/registrar/subjects");
			setSubjects(res.data.subjects);
		};
		getSubjects();
	}, []);
	useEffect(() => {
		if (teachers.length === 0 || subjects.length === 0) return;
		api.get("/schedule/get").then((res) => {
			// Create an empty grid
			const newSchedule = times.map(() =>
				teachers.map(() => ({
					value: "",
					teacher: "",
					subject: "",
				}))
			);
			res.data.forEach((item: any) => {
				item.schedule.forEach((slot: any) => {
					// Find the time row
					const timeLabel = `${slot.startTime}-${slot.endTime}`;
					const row = times.indexOf(timeLabel);
					// Find the teacher column by _id
					const col = teachers.findIndex((t) => t._id === item.teacherId._id);
					// Find the subject name by _id
					const subjectObj = subjects.find((s) => s._id === item.subjectId._id);
					if (row !== -1 && col !== -1 && subjectObj) {
						newSchedule[row][col] = {
							value: `${teachers[col].name} - ${subjectObj.subjectName}`,
							teacher: item.teacherId._id,
							subject: item.subjectId._id,
						};
					}
				});
			});
			setSchedule(newSchedule);
		});
	}, [teachers, subjects]);

	return (
		<Grid>
			<GridCard>
				<TeacherScheduleTable
					times={times}
					sections={sections}
					teachers={teachers}
					schedule={schedule}
					subjects={subjects}
				/>
			</GridCard>
		</Grid>
	);
};

export default Teachers;
