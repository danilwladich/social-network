import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { ISettings } from "../models/ISettings";

const initialState: ISettings = {
	bodyTheme:
		localStorage.getItem("theme") ||
		(window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light"),
};

export function settingsReducer(
	state: ISettings = initialState,
	action: IAction
) {
	switch (action.type) {
		case ActionType.SET_THEME:
			document.documentElement.setAttribute("theme", action.value);
			localStorage.setItem("theme", action.value);
			return {
				...state,
				bodyTheme: action.value,
			};

		default:
			return state;
	}
}

// action
export const setTheme: (v: string) => IAction = (v) => ({
	type: ActionType.SET_THEME,
	value: v,
});
