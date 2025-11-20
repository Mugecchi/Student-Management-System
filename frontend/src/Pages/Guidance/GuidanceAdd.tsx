import Button from "@/Components/ui/Button";
import { useToast } from "@/hooks/ToastContext";
import { api } from "@/lib/axios";
import React from "react";

type FormTypes = {
	guidanceRecord: string;
	student: string;
};

type ServiceType = {
	_id: string;
	title: string;
};
type StudentType = {
	_id: string;
	fullName: string;
};
const GuidanceAdd = () => {
	const toast = useToast();

	const [form, setForm] = React.useState<FormTypes>({
		guidanceRecord: "",
		student: "",
	});

	const [selection, setSelection] = React.useState<ServiceType[]>([]);
	const [student, selectStudent] = React.useState<StudentType[]>([]);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (form.student === "") {
				toast?.open({
					type: "error",
					message: `Student not found.`,
				});
				return;
			}
			const response = await api.post(`/guidance/submit/${form.student}`, form);
			return response.data;
		} catch (error) {
			toast?.open({
				type: "error",
				message: `Error adding guidance record: ${error}`,
			});
		}
	};
	// fetch services like your <select> version
	React.useEffect(() => {
		const fetchSettings = async () => {
			try {
				const res = await api.get("/guidance/getselection");
				setSelection(res.data.settings);
				selectStudent(res.data.students);
			} catch (error) {
				console.error("Error fetching services:", error);
			}
		};

		fetchSettings();
	}, []);
	const handleStudentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fullName = e.target.value;
		const selectedStudent = student.find((item) => item.fullName === fullName);
		setForm({
			...form,
			student: selectedStudent ? selectedStudent._id : "",
		});
	};
	// Convert title → id when user selects an option
	const handleGuidanceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value;

		const selected = selection.find((item) => item.title === title);

		setForm({
			...form,
			guidanceRecord: selected ? selected._id : "",
		});
	};

	return (
		<div className="flex flex-col w-full">
			<div className="flex justify-end text-gray-500 font-semibold">
				Add Guidance Record
			</div>

			<form className="flex flex-col space-y-4 mt-4" onSubmit={handleSubmit}>
				<label>Student</label>
				<input
					className="input"
					list="studentList"
					placeholder="Jon Snow"
					onChange={handleStudentInput}
				/>
				<datalist id="studentList">
					{student.map((item) => (
						<option key={item._id} value={item.fullName} />
					))}
				</datalist>

				<label>Service</label>

				{/* USER TYPES TITLE → WE STORE ID */}
				<input
					className="input"
					list="serviceList"
					onChange={handleGuidanceInput}
					placeholder="Select a service"
				/>

				<datalist id="serviceList">
					{selection.map((item) => (
						<option key={item._id} value={item.title} />
					))}
				</datalist>
				<Button type="submit">Add Guidance Record</Button>
			</form>
		</div>
	);
};

export default GuidanceAdd;
