export interface ProfilePostData {
	id: string;
	date: string;
	post?: string;
	images?: string[];
	likes: number;
	likedMe: boolean;
}
