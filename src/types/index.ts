// Types
export interface LeadData {
	id: string;
	name: string;
	type: string;
	status: string;
	date: string;
	size: string;
	image: string;
	recordCount?: number;
	analysis?: {
		sentiment: {
			positive: number;
			neutral: number;
			negative: number;
		};
		topics: string[];
		score: number;
	};
}

export interface LeadsContextType {
	leads: LeadData[];
	updateLead: (id: string, data: Partial<LeadData>) => void;
}

export interface AuthContextType {
	isAuthenticated: boolean;
	user: { email: string } | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

export interface StatCard {
	title: string;
	value: string;
	change: string;
	icon: React.ReactNode;
	bgColor: string;
}
