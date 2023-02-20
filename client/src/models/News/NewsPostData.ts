import { NewsPostOwnerData } from "./NewsPostOwnerData";

export interface NewsPostData {
	owner: NewsPostOwnerData;
	id: string;
	date: string;
	post: string;
	likes: number;
	likedMe: boolean;
}
