import { FriendsUserData } from "./FriendsUserData";
import { WhoseFriends } from "./WhoseFriends";

export interface IFriends {
	whoseFriends: WhoseFriends;
	usersData: FriendsUserData[];
	pageSize: number;
	totalCount: number;
}
