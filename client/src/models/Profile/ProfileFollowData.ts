import { ProfileFollowUserData } from "./ProfileFollowUserData";

export interface ProfileFollowData {
	friends: {
		usersData: ProfileFollowUserData[];
		totalCount: number;
	};
	followers: number;
	following: number;
}
