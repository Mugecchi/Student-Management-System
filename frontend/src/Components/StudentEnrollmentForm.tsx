import React, { useState } from "react";
import type { EnrollmentData } from "@/types/enrollment";
import { enroll } from "@/api/posts/Enrollment";
import { useAuth } from "@/hooks/AuthContext";
import Button from "./ui/Button";

const defaultFormData: EnrollmentData = {
	studentNumber: "",
	first_name: "",
	middle_name: "",
	last_name: "",
	dateOfBirth: "",
	motherName: "",
	motherContact: "",
	fatherName: "",
	fatherContact: "",
	guardianName: "",
	address: "",
	guardianContact: "",
	yearLevel: "",
	sectionName: undefined,
};
const StudentEnrollmentForm = () => {
	const [formData, setFormData] = useState<EnrollmentData>(defaultFormData);
	const { refresh } = useAuth();
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		try {
			enroll(formData);
			setFormData(defaultFormData);
			refresh();
			alert("Enrollment successful!");
		} catch (error) {
			console.error("Enrollment failed:", error);
		}
	};
	console.log(formData);
	return (
		<form
			onSubmit={handleSubmit}
			className="w-full h-full grid grid-cols-3 gap-x-6 gap-y-0 items-end"
		>
			<div>
				<label className="auth-input-label" htmlFor="studentNumber">
					Student Number
				</label>
				<input
					className="input"
					type="text"
					id="studentNumber"
					name="studentNumber"
					value={formData.studentNumber}
					onChange={handleChange}
					required
				/>
			</div>

			<div>
				<label className="auth-input-label" htmlFor="first_name">
					First Name
				</label>
				<input
					className="input"
					type="text"
					id="first_name"
					name="first_name"
					value={formData.first_name}
					onChange={handleChange}
					required
				/>
			</div>

			<div>
				<label className="auth-input-label" htmlFor="middle_name">
					Middle Name
				</label>
				<input
					className="input"
					type="text"
					id="middle_name"
					name="middle_name"
					value={formData.middle_name}
					onChange={handleChange}
				/>
			</div>

			<div>
				<label className="auth-input-label" htmlFor="last_name">
					Last Name
				</label>
				<input
					className="input"
					type="text"
					id="last_name"
					name="last_name"
					value={formData.last_name}
					onChange={handleChange}
					required
				/>
			</div>

			<div>
				<label className="auth-input-label" htmlFor="dateOfBirth">
					Date of Birth
				</label>
				<input
					className="input"
					type="date"
					id="dateOfBirth"
					name="dateOfBirth"
					value={formData.dateOfBirth}
					onChange={handleChange}
					required
				/>
			</div>

			<div>
				<label className="auth-input-label" htmlFor="motherName">
					Mother's Name
				</label>
				<input
					className="input"
					type="text"
					id="motherName"
					name="motherName"
					value={formData.motherName}
					onChange={handleChange}
				/>
			</div>

			<div>
				<label className="auth-input-label" htmlFor="motherContact">
					Mother's Contact
				</label>
				<input
					className="input"
					type="number"
					id="motherContact"
					name="motherContact"
					value={formData.motherContact}
					pattern="^\+?\d{10,15}$"
					placeholder="e.g. +1234567890"
					onChange={handleChange}
					required
				/>
			</div>

			<div>
				<label className="auth-input-label" htmlFor="fatherName">
					Father's Name
				</label>
				<input
					className="input"
					type="text"
					id="fatherName"
					name="fatherName"
					value={formData.fatherName}
					onChange={handleChange}
				/>
			</div>

			<div>
				<label className="auth-input-label" htmlFor="fatherContact">
					Father's Contact
				</label>
				<input
					className="input"
					type="number"
					id="fatherContact"
					name="fatherContact"
					value={formData.fatherContact}
					onChange={handleChange}
					pattern="^\+?\d{10,15}$"
					placeholder="e.g. +1234567890"
					required
				/>
			</div>

			<div>
				<label className="auth-input-label" htmlFor="guardianName">
					Guardian's Name
				</label>
				<input
					className="input"
					type="text"
					id="guardianName"
					name="guardianName"
					value={formData.guardianName}
					onChange={handleChange}
				/>
			</div>

			<div>
				<label className="auth-input-label" htmlFor="guardianContact">
					Guardian's Contact
				</label>
				<input
					className="input"
					type="number"
					id="guardianContact"
					name="guardianContact"
					value={formData.guardianContact}
					onChange={handleChange}
					pattern="^\+?\d{10,15}$"
					placeholder="e.g. +1234567890"
					required
				/>
			</div>

			<div>
				<label className="auth-input-label">Address</label>
				<input
					className="input"
					id="address"
					name="address"
					value={formData.address}
					onChange={handleChange}
					required
				/>
			</div>

			<div>
				<label className="auth-input-label" htmlFor="yearLevel">
					Year Level
				</label>
				<input
					className="input"
					type="text"
					id="yearLevel"
					name="yearLevel"
					value={formData.yearLevel}
					onChange={handleChange}
					required
				/>
			</div>
			<div className="col-span-1 col-start-3">
				<Button type="submit">Submit</Button>
			</div>
		</form>
	);
};

export default StudentEnrollmentForm;
