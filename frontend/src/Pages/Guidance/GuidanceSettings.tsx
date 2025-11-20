import Button from "@/Components/ui/Button";
import { useToast } from "@/hooks/ToastContext";
import { api } from "@/lib/axios";
import React from "react";

interface FormType {
	title: string;
	description: string;
}

const GuidanceSettings = () => {
	const [form, setForm] = React.useState<FormType>({
		title: "",
		description: "",
	});

	const [loading, setLoading] = React.useState(false);

	const toast = useToast();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await api.post("/guidance/add", form);

			toast?.open({
				type: "success",
				message: "Guidance setting added successfully",
			});

			// Reset form
			setForm({ title: "", description: "" });

			return response.data;
		} catch (err: unknown) {
			let errorMsg = "Something went wrong";

			if (err instanceof Error) {
				errorMsg = err.message;
			} else if (typeof err === "object" && err !== null) {
				const e = err as {
					response?: { data?: { message?: string } };
					message?: string;
				};
				errorMsg = e.response?.data?.message ?? e.message ?? errorMsg;
			}

			toast?.open({
				type: "error",
				message: `Error adding service: ${errorMsg}`,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full flex flex-col">
			<div className="flex justify-end text-gray-500 font-semibold">
				Guidance Settings
			</div>

			<form className="flex flex-col space-y-4 mt-4" onSubmit={handleSubmit}>
				<div className="flex flex-col">
					<label htmlFor="title" className="font-medium">
						Title
					</label>
					<input
						id="title"
						className="input"
						type="text"
						name="title"
						value={form.title}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="flex flex-col">
					<label htmlFor="description" className="font-medium">
						Description
					</label>
					<textarea
						id="description"
						className="input h-24 resize-none"
						name="description"
						value={form.description}
						onChange={handleChange}
						required
					/>
				</div>

				<Button type="submit" disabled={loading}>
					{loading ? "Submitting..." : "Add Guidance Setting"}
				</Button>
			</form>
		</div>
	);
};

export default GuidanceSettings;
