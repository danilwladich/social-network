export interface IApp {
	errorMessage?: string;
	submitModal: {
		text: string;
		thunk: (...args: any[]) => any;
	};
}
