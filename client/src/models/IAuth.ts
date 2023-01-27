export interface IAuth {
	user: {
		id: string;
		token: string;
	};
	isAuth: boolean;
}
