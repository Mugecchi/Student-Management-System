import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { api } from "@/lib/axios";
import GridCard, { Grid } from "@/Components/ui/GridCard";

type DashboardData = {
	studentCount: number;
	teacherCount: number;
	subjectCount: number;
	sectionCount: number;
	recentGrades: Array<{
		_id: string;
		studentId?: { studentNumber?: string; _id?: string };
		scheduleId?: {
			sectionId?: string;
			subjectId?: { subjectName?: string };
		};
		firstQuarterGrade?: number;
		secondQuarterGrade?: number;
		thirdQuarterGrade?: number;
		fourthQuarterGrade?: number;
		remarks?: string;
	}>;
	upcomingSchedules: Array<{
		_id: string;
		sectionId?: string;
		subjectId?: { subjectName?: string };
		schedule?: Array<{ startTime?: string; endTime?: string }>;
	}>;
	currentAcadYear?: string;
};

const Dashboard = () => {
	const [data, setData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		setLoading(true);
		api
			.get("/grade/dashboard")
			.then((res) => {
				setData(res.data);
				setError("");
			})
			.catch((err) => {
				setError(
					err.response?.data?.message || "Failed to fetch dashboard data."
				);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading)
		return <div className="p-8 text-center">Loading dashboard...</div>;
	if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
	if (!data) return null;

	// ...existing code...
	const handleExportGrades = () => {
		if (!data || !data.recentGrades?.length) return;

		// Construct rows manually like a table
		const rows = [
			["REPORT ON LEARNING PROGRESS AND ACHIEVEMENT"],
			[], // blank line
			["LEARNING AREAS", "1", "2", "3", "4", "FINAL GRADE", "REMARKS"],
		];

		// Add each subject and grades
		data.recentGrades.forEach((g) => {
			const subject = g.scheduleId?.subjectId?.subjectName || "";
			rows.push([
				subject,
				g.firstQuarterGrade !== undefined ? String(g.firstQuarterGrade) : "",
				g.secondQuarterGrade !== undefined ? String(g.secondQuarterGrade) : "",
				g.thirdQuarterGrade !== undefined ? String(g.thirdQuarterGrade) : "",
				g.fourthQuarterGrade !== undefined ? String(g.fourthQuarterGrade) : "",
				"", // final grade (optional calculation)
				g.remarks || "",
			]);
		});

		// Add general average row
		rows.push(["General Average", "", "", "", "", "", ""]);

		// Create worksheet
		const ws = XLSX.utils.aoa_to_sheet(rows);

		// Merge title row
		ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];

		// Column widths
		ws["!cols"] = [
			{ wch: 30 }, // Learning Areas
			{ wch: 8 }, // Q1
			{ wch: 8 },
			{ wch: 8 },
			{ wch: 8 },
			{ wch: 12 }, // Final Grade
			{ wch: 15 }, // Remarks
		];

		// Basic cell styling
		Object.keys(ws).forEach((cell) => {
			if (cell[0] === "!") return; // skip meta
			const cellObj = ws[cell];
			cellObj.s = {
				alignment: { horizontal: "center", vertical: "center" },
				font: { name: "Arial", sz: 10 },
			};
		});

		// Header style
		const headerRow = 2;
		for (let c = 0; c <= 6; c++) {
			const cell = XLSX.utils.encode_cell({ r: headerRow, c });
			if (ws[cell]) {
				ws[cell].s = {
					font: { bold: true, color: { rgb: "FFFFFF" } },
					fill: { fgColor: { rgb: "305496" } },
					alignment: { horizontal: "center", vertical: "center" },
					border: {
						top: { style: "thin", color: { rgb: "000000" } },
						bottom: { style: "thin", color: { rgb: "000000" } },
						left: { style: "thin", color: { rgb: "000000" } },
						right: { style: "thin", color: { rgb: "000000" } },
					},
				};
			}
		}

		// Title style
		ws["A1"].s = {
			font: { bold: true, sz: 14 },
			alignment: { horizontal: "center", vertical: "center" },
		};

		// Freeze panes (keep header visible)
		ws["!freeze"] = { xSplit: 0, ySplit: 3 };

		// Workbook creation
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Report Card");

		const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
		const blob = new Blob([excelBuffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		saveAs(blob, `report_card_${new Date().toISOString().slice(0, 10)}.xlsx`);
	};

	return (
		<Grid>
			<GridCard>
				<h1 className="text-3xl font-bold mb-6 text-amber-600">Dashboard</h1>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
					<div
						className=" 
 bg-gray-800 rounded-lg shadow p-4 text-center"
					>
						<div className="text-2xl font-bold text-amber-500">
							{data.studentCount}
						</div>
						<div className="text-gray-300">Students</div>
					</div>
					<div
						className=" 
 bg-gray-800 rounded-lg shadow p-4 text-center"
					>
						<div className="text-2xl font-bold text-amber-500">
							{data.teacherCount}
						</div>
						<div className=" text-gray-300">Teachers</div>
					</div>
					<div
						className=" 
 bg-gray-800 rounded-lg shadow p-4 text-center"
					>
						<div className="text-2xl font-bold text-amber-500">
							{data.subjectCount}
						</div>
						<div className=" text-gray-300">Subjects</div>
					</div>
					<div
						className=" 
 bg-gray-800 rounded-lg shadow p-4 text-center"
					>
						<div className="text-2xl font-bold text-amber-500">
							{data.sectionCount}
						</div>
						<div className=" text-gray-300">Sections</div>
					</div>
				</div>
				<div className="mb-8">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-xl font-bold text-slate-700">Recent Grades</h2>
						{data.recentGrades.length > 0 && (
							<button
								onClick={handleExportGrades}
								className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded shadow text-sm"
							>
								Export to Excel
							</button>
						)}
					</div>
					{data.recentGrades.length === 0 ? (
						<div className="text-gray-500">No recent grades.</div>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full bg-gray-800 border  border-gray-700 rounded-lg">
								<thead>
									<tr className=" bg-amber-900">
										<th className="py-2 px-3 text-left">Student</th>
										<th className="py-2 px-3 text-left">Section</th>
										<th className="py-2 px-3 text-left">Subject</th>
										<th className="py-2 px-3 text-left">1st Qtr</th>
										<th className="py-2 px-3 text-left">2nd Qtr</th>
										<th className="py-2 px-3 text-left">3rd Qtr</th>
										<th className="py-2 px-3 text-left">4th Qtr</th>
										<th className="py-2 px-3 text-left">Remarks</th>
									</tr>
								</thead>
								<tbody>
									{data.recentGrades.map((g) => (
										<tr key={g._id} className="border-t  border-gray-700">
											<td className="py-2 px-3">
												{g.studentId?.studentNumber || g.studentId?._id}
											</td>
											<td className="py-2 px-3">{g.scheduleId?.sectionId}</td>
											<td className="py-2 px-3">
												{g.scheduleId?.subjectId?.subjectName}
											</td>
											<td className="py-2 px-3">
												{g.firstQuarterGrade ?? "-"}
											</td>
											<td className="py-2 px-3">
												{g.secondQuarterGrade ?? "-"}
											</td>
											<td className="py-2 px-3">
												{g.thirdQuarterGrade ?? "-"}
											</td>
											<td className="py-2 px-3">
												{g.fourthQuarterGrade ?? "-"}
											</td>
											<td className="py-2 px-3">{g.remarks}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
				<div className="mb-8">
					<h2 className="text-xl font-bold mb-2 text-slate-700">
						Upcoming Schedules
					</h2>
					{data.upcomingSchedules.length === 0 ? (
						<div className="text-gray-500">No upcoming schedules.</div>
					) : (
						<ul className="list-disc pl-6">
							{data.upcomingSchedules.map((s) => (
								<li key={s._id} className="mb-1">
									{/* Customize as needed */}
									{s.sectionId} - {s.subjectId?.subjectName} (
									{s.schedule && s.schedule[0]
										? `${s.schedule[0].startTime}-${s.schedule[0].endTime}`
										: ""}
									)
								</li>
							))}
						</ul>
					)}
				</div>
				<div>
					<h2 className="text-xl font-bold mb-2 text-slate-700">
						Academic Year
					</h2>
					{data.currentAcadYear ? (
						<div className=" text-gray-300">{data.currentAcadYear}</div>
					) : (
						<div className="text-gray-500">No academic year set.</div>
					)}
				</div>
			</GridCard>
		</Grid>
	);
};

export default Dashboard;
