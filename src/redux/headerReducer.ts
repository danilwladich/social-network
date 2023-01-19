import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { IHeader } from "../models/IHeader";

const initialState: IHeader = {
	headerImage: localStorage.getItem("headerUserImage") || "",
	burger: false,
};

export function headerReducer(state: IHeader = initialState, action: IAction) {
	switch (action.type) {
		case ActionType.SET_HEADER_IMAGE:
			localStorage.setItem("headerUserImage", action.value);
			return {
				...state,
				headerImage: action.value,
			};

		case ActionType.SET_BURGER:
			const bodyLock = document.querySelector("body");
			if (action.value) {
				bodyLock?.classList.add("lock");
			} else {
				bodyLock?.classList.remove("lock");
			}
			return {
				...state,
				burger: action.value,
			};

		default:
			return state;
	}
}

// action
export const setHeaderImage: (v: string) => IAction = (v) => ({
	type: ActionType.SET_HEADER_IMAGE,
	value: v,
});

export const setBurger: (v: boolean) => IAction = (v) => ({
	type: ActionType.SET_BURGER,
	value: v,
});
