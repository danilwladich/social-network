import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { IMessages } from "../models/Messages/IMessages";

const initialState: IMessages = {
	usersData: [],
	chatWith: {
		id: "",
		firstName: "",
		lastName: "",
		image: "",
	},
	messagesData: [],
};

export function messagesReducer(
	state: IMessages = initialState,
	action: IAction
) {
	switch (action.type) {
		case ActionType.SEND_MESSAGE:
			const newMessage = {
				id: state.messagesData.length
					? state.messagesData[state.messagesData.length - 1].id + 1
					: 1,
				message: action.value,
				date: new Date().toString().split(" ").slice(1, 5).join(" "),
				out: true,
			};
			return {
				...state,
				messagesData: [...state.messagesData, newMessage],
			};

		default:
			return state;
	}
}

// action
export const sendMessage: (v: string) => IAction = (v) => ({
	type: ActionType.SEND_MESSAGE,
	value: v,
});
