import { NewsPostData } from "./NewsPostData";

export interface INews {
	postsData: NewsPostData[];
	pageSize: number;
	totalCount: number;
}
