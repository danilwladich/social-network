export interface FriendsUserData {
	nickname: string;
	firstName: string;
	lastName: string;
	image?: string;
	location: {
		country?: string;
		city?: string;
	};
	follower: boolean;
	followed: boolean;
	online: number | boolean;
}
