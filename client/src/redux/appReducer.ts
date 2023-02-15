import { AxiosError } from "axios";
import { Dispatch } from "react";
import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { IApp } from "../models/IApp";
import { authMeTC } from "./authReducer";

const initialState: IApp = {
	errorMessage: "",
};

export function appReducer(state: IApp = initialState, action: IAction) {
	switch (action.type) {
		case ActionType.SET_ERROR_MESSAGE:
			return {
				...state,
				errorMessage: action.value,
			};

		default:
			return state;
	}
}

// action
export const setErrorMessage: (v: string) => IAction = (v) => ({
	type: ActionType.SET_ERROR_MESSAGE,
	value: v,
});

// thunk
export const initializationTC = () => {
	return async (dispatch: Dispatch<any>) => {
		try {
			dispatch(setErrorMessage(""));
			await dispatch(authMeTC());
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Initialization: " + error.message));
		}
	};
};
