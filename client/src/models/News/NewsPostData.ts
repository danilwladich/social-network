export interface NewsPostData {
	owner: {
		nickname: string;
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
