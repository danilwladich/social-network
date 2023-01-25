export interface ProfileAboutData {
	friends: number;
	follow: {
		followers: number;
		following: number;
	};
	location: {
		country?: string;
		city?: string;
	};
}
