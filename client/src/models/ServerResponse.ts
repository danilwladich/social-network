export interface ServerResponse<T = void> {
	success: boolean;
	statusText: string;
	items: T;
}
