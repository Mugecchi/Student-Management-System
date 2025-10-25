export interface EnrollmentData {
	studentNumber: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	dateOfBirth: string;
	motherName: string;
	fullName?: string;
	motherContact: string;
	fatherName: string;
	fatherContact: string;
	guardianName: string;
	address: string;
	guardianContact: string;
	yearLevel: string;
	username?: string;
	phone?: string;
	userType?: string;

	_id?: string;
}

export interface User {
	_id?: string;
	full_Name?: string;
	first_name?: string;
	middle_name?: string;
	lastName?: string;
	email?: string;
	fullName?: string;
	userType?: string;
	profilePic?: string;
	status?: string;
	last_login?: string;
}

export interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (data: { username: string; password: string }) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
	signup: (data: {
		username: string;
		first_name: string;
		middle_name: string;
		last_name: string;
		phone: string;
		password: string;
		role: string;
	}) => Promise<void>;
	refresh: () => void;
	refreshTrigger: number;
}

export interface AcademicYearForm {
	yearStart?: string;
	yearEnd?: string;
	semester?: string;
	startDate?: string;
	endDate?: string;
	isCurrent?: boolean;
}

export interface SubjectForm {
	subjectCode?: string;
	subjectName?: string;
	yearLevel?: string;
	semester?: string;
	credits?: number;
	id?: string;
	description?: string;
	units?: number;
}
