export interface IApp {
	errorMessage?: string;
	authProfile: {
		firstName: string;
		lastName: string;
		image?: string;
	};
}
