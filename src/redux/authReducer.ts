import { AxiosError } from "axios";
import { Dispatch } from "react";
import { API } from "../API/API";
import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { IAuth } from "../models/IAuth";
import { setErrorMessage } from "./appReducer";

const initialState: IAuth = {
	user: {
		id: "",
	},
	isAuth: false,
};

export function authReducer(state: IAuth = initialState, action: IAction) {
	switch (action.type) {
		case ActionType.SET_AUTH_USER:
			return {
				...state,
				user: { ...action.value },
				isAuth: true,
			};

		case ActionType.NOT_AUTH_USER:
			return {
				...state,
				user: {},
				isAuth: false,
			};

		default:
			return state;
	}
}

// action
export const setAuthUser: (user: IAuth) => IAction = (user) => ({
	type: ActionType.SET_AUTH_USER,
	value: user,
});

export const notAuthUser: () => IAction = () => ({
	type: ActionType.NOT_AUTH_USER,
});

// thunk
export const authMeTC = () => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.authMe().then((data) => {
				if (data.success === true) {
					dispatch(setAuthUser(data.user));
				} else {
					dispatch(notAuthUser());
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Auth: " + error.message));
		}
	};
};

export const loginTC = (phoneNumber: string, password: string) => {
	return async (dispatch: Dispatch<any>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.login(phoneNumber, password).then((data) => {
				if (data.success === true) {
					dispatch(authMeTC());
				} else {
					return Promise.reject(data.statusText);
				}
			});
		} catch (e: unknown) {
			if (typeof e === "string") {
				return Promise.reject(e);
			}

			const error = e as AxiosError;
			dispatch(setErrorMessage("Login: " + error.message));
			return Promise.reject();
		}
	};
};

export const registerTC = (
	phoneNumber: string,
	password: string,
	firstName: string,
	lastName: string
) => {
	return async (dispatch: Dispatch<any>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.register(phoneNumber, password, firstName, lastName).then(
				(data) => {
					if (data.success === true) {
						dispatch(loginTC(phoneNumber, password));
					} else {
						return Promise.reject(data.statusText);
					}
				}
			);
		} catch (e: unknown) {
			if (typeof e === "string") {
				return Promise.reject(e);
			}

			const error = e as AxiosError;
			dispatch(setErrorMessage("Register: " + error.message));
			return Promise.reject();
		}
	};
};

export const logoutTC = () => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.logout().then((data) => {
				if (data.success === true) {
					dispatch(notAuthUser());
				} else {
					dispatch(setErrorMessage("Logout: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Logout: " + error.message));
		}
	};
};
