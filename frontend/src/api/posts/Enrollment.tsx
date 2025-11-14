import { api } from "@/lib/axios";
import type { EnrollmentData } from "@/types/enrollment";

export const enroll = async (data: EnrollmentData) => {
	const res = await api.post("/registrar/enroll", data);
	return res.data;
};
