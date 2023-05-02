import { NewsPostOwnerData } from "./NewsPostOwnerData";

export interface NewsPostData {
	owner: NewsPostOwnerData;
	id: string;
	date: number;
	post?: string;
	images?: string[];
	likes: number;
	likedMe: boolean;
}
