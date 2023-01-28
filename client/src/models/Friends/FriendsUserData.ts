export interface FriendsUserData {
	id: string;
	firstName: string;
	lastName: string;
	image?: string;
	location: {
		country?: string;
		city?: string;
	};
	follower: boolean;
	followed: boolean;
}