import { ProfileUserData } from "./ProfileUserData";
import { ProfileFollowData } from "./ProfileFollowData";
import { ProfilePostData } from "./ProfilePostData";

export interface IProfile {
	userData: ProfileUserData;
	followData: ProfileFollowData;
	postsData: ProfilePostData[];
	pageSize: number;
	totalCount: number;
}
