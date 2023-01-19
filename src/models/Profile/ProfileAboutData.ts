export interface ProfileAboutData {
	friends: number;
	follow: {
		followers: number;
		followed: number;
	};
	location: {
		country?: string;
		city?: string;
	};
}
