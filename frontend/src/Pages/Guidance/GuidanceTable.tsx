import { api } from "@/lib/axios";
import React, { useEffect } from "react";
type GuidanceRecord = {
	_id: string;
	student: {
		name: string;
		studentId: string;
	};
	counselor: {
		first_name: string;
		last_name: string;
	};
	guidanceRecord: string;
};
const GuidanceTable = () => {
	const [records, setRecords] = React.useState<GuidanceRecord[]>([]); // Use 'any' or define a proper type
	useEffect(() => {
		const fetchGuidanceRecords = async () => {
			try {
				const res = await api.get("/guidance/records");
				setRecords(res.data.records);
			} catch (error) {
				console.error("Error fetching guidance records:", error);
			}
		};
		fetchGuidanceRecords();
	}, []);

	return (
		<div className="flex">
			<div className="w-full">
				<h1 className="text-gray-500 text-4xl font-semibold">
					Service Records
				</h1>
				<table className="min-w-full overflow-hidden border-collapse border border-gray-200">
					<thead>
						<tr>
							<th className="border border-gray-300 p-4">Student Name</th>
							<th className="border border-gray-300 p-4">Student ID</th>
							<th className="border border-gray-300 p-4">
								Counselor First Name
							</th>
							<th className="border border-gray-300 p-4">
								Counselor Last Name
							</th>
							<th className="border border-gray-300 p-4">Guidance Record</th>
						</tr>
					</thead>
					<tbody>
						{records.map((record) => (
							<tr key={record._id} className="hover:bg-gray-50">
								<td className="border border-gray-300 p-4">
									{record.student.name}
								</td>
								<td className="border border-gray-300 p-4">
									{record.student.studentId}
								</td>
								<td className="border border-gray-300 p-4">
									{record.counselor.first_name}
								</td>
								<td className="border border-gray-300 p-4">
									{record.counselor.last_name}
								</td>
								<td className="border border-gray-300 p-4">
									{record.guidanceRecord}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default GuidanceTable;
