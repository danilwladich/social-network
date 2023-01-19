import { ProfileUserData } from "./ProfileUserData";
import { ProfileAboutData } from "./ProfileAboutData";
import { ProfilePostData } from "./ProfilePostData";

export interface IProfile {
	userData: ProfileUserData;
	aboutData: ProfileAboutData;
	postsData: ProfilePostData[];
	pageSize: number;
	totalCount: number;
}
