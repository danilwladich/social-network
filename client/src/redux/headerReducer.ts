import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { IHeader } from "../models/IHeader";

const initialState: IHeader = {
	burger: false,
};

export function headerReducer(state: IHeader = initialState, action: IAction) {
	switch (action.type) {
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
export const setBurger: (v: boolean) => IAction = (v) => ({
	type: ActionType.SET_BURGER,
	value: v,
});
