import { AxiosError } from "axios";
import { Dispatch } from "redux";
import { API } from "../API/API";
import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { DonationData } from "../models/Settings/DonationData";
import { ISettings } from "../models/Settings/ISettings";
import { setErrorMessage } from "./appReducer";

const initialState: ISettings = {
	bodyTheme:
		localStorage.getItem("theme") ||
		(window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light"),
	donationsData: [],
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

		case ActionType.SET_DONATIONS:
			return {
				...state,
				donationsData: action.value,
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

export const setDonations: (donationsData: DonationData[]) => IAction = (
	donationsData
) => ({
	type: ActionType.SET_DONATIONS,
	value: donationsData,
});

// thunk
export const getDonationsTC = () => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.getDonations().then((data) => {
				if (data.success === true) {
					dispatch(setDonations(data.donationsData));
				} else {
					dispatch(setErrorMessage("Get donations: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get donations: " + error.message));
		}
	};
};

export const newDonationTC = (value: number) => {
	return async (dispatch: Dispatch<any>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.newDonation(value).then(async (data) => {
				if (data.success === true) {
					await dispatch(getDonationsTC());
				} else {
					dispatch(setErrorMessage("Donation: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Donation: " + error.message));
		}
	};
};
