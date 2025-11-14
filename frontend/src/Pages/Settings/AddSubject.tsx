import type { SubjectForm } from "@/types/enrollment";
import React from "react";

interface AddSubjectProps {
	onSubmit?: (form: SubjectForm) => void;
}
const formData = ["subjectCode", "subjectName", "description", "units"];
const AddSubject = ({ onSubmit }: AddSubjectProps) => {
	const [form, setForm] = React.useState<SubjectForm>({});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (onSubmit) {
			onSubmit(form);
		}
	};
	const toTitleCase = (text: string) => {
		return text
			.replace(/([A-Z])/g, " $1") // insert space before capital letters
			.replace(/^./, (str) => str.toUpperCase()) // capitalize first letter
			.trim();
	};
	return (
		<>
			<label className="text-slate-600 font-semibold self-center ">
				Add Subject
			</label>
			<form
				id="subject-addition-form"
				className="grid grid-col-2"
				onSubmit={handleSubmit}
			>
				<div className="grid grid-cols-2 gap-2">
					{formData.map((field) => (
						<div className="col-span-1">
							<label className="auth-input-label" key={field}>
								{toTitleCase(field)}
							</label>
							<input
								key={`${field} input`}
								className="input"
								onChange={handleChange}
								name={field}
								type={field !== "units" ? "text" : "number"}
								min={field === "units" ? 0 : undefined}
								max={field === "units" ? 3 : undefined}
							/>
						</div>
					))}
				</div>
			</form>
		</>
	);
};

export default AddSubject;
