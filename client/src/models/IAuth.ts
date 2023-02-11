export interface IAuth {
	user: {
		nickname: string;
		token: string;
	};
	isAuth: boolean;
}
