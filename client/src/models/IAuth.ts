export interface IAuth {
	user: {
		nickname: string;
		token: string;
	};
	authProfile: {
		firstName: string;
		lastName: string;
		image?: string;
	};
	isAuth: boolean;
}
