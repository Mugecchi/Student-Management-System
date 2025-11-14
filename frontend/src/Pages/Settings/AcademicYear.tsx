import { useState } from "react";
import { type AcademicYearForm } from "@/types/enrollment";
interface AcademicYearProps {
	onSubmit: (form: AcademicYearForm) => void; // parent callback
}
const AcademicYear = ({ onSubmit }: AcademicYearProps) => {
	const [form, setForm] = useState<AcademicYearForm>({});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(form);
	};
	return (
		<div className="w-full font-semibold justify-center flex items-center gap-2 flex-col ">
			<label className=" text-slate-600 font-semibold">Academic Year</label>
			<form
				id="academic-year-form"
				onSubmit={handleSubmit}
				className="space-y-0 w-full gap-2 grid grid-cols-2"
			>
				<div className="col-span-2">
					<label className="auth-input-label">Semester</label>
					<select
						required
						className="input"
						name="semester"
						onChange={handleChange}
					>
						<option value={""}>Select Semester</option>
						{["1st Semester", "2nd Semester", "Summer"].map((sem) => (
							<option key={sem} className="bg-slate-600" value={sem}>
								{sem}
							</option>
						))}
					</select>
				</div>
				<div className="col-span-1">
					<label className="auth-input-label">Start Date</label>
					<input
						className="input"
						type="date"
						name="startDate"
						onChange={handleChange}
					/>
				</div>
				<div className="col-span-1">
					<label className="auth-input-label">End Date</label>
					<input
						onChange={handleChange}
						name="endDate"
						className="input"
						type="date"
						min={new Date().toISOString().split("T")[0]}
					/>
				</div>
			</form>
		</div>
	);
};

export default AcademicYear;
