export interface NewsPostData {
	owner: {
		id: string;
		firstName: string;
		lastName: string;
		image?: string;
	};
	id: string;
	date: string;
	post: string;
	likes: number;
	likedMe: boolean;
}
