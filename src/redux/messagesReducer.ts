import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { IMessages } from "../models/Messages/IMessages";

const initialState: IMessages = {
	usersData: [
		{
			id: "danilwladich",
			firstName: "Danil",
			lastName: "Wladich",
			image:
				"https://sun9-east.userapi.com/sun9-24/s/v1/ig2/oBKM4lV1C-ju3ALxjXv7-FTQYeAyFIPITgJA2jYhXHoal3Xk3JlzwEAQSTmYAU5SqYIgZKQ2Lcx8A77SHeCfCIbn.jpg?size=994x1005&quality=95&type=album",
		},
		{
			id: "kolyahellcoder",
			firstName: "Kolya",
			lastName: "Kostenko",
			image: "",
		},
		{
			id: "artembog",
			firstName: "Artem",
			lastName: "Krutoj",
			image: "",
		},
		{
			id: "welichajshyj",
			firstName: "Papich",
			lastName: "Welikij",
			image: "",
		},
	],
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
