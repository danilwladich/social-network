export interface ProfilePostData {
	id: string;
	date: number;
	post?: string;
	images?: string[];
	likes: number;
	likedMe: boolean;
}
