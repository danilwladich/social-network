import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./reducers/messagesReducer";
import profileReducer from "./reducers/profileReducer";
import settingsReducer from "./reducers/settingsReducer";
import usersReducer from "./reducers/usersReducer";
import authReducer from "./reducers/authReducer";
import appReducer from "./reducers/appReducer";
import headerReducer from "./reducers/headerReducer";
import friendsReducer from "./reducers/friendsReducer";
import newsReducer from "./reducers/newsReducer";

const reducers = combineReducers({
	app: appReducer,
	header: headerReducer,
	auth: authReducer,
	profile: profileReducer,
	news: newsReducer,
	messages: messagesReducer,
	friends: friendsReducer,
	users: usersReducer,
	settings: settingsReducer,
});

export const store = configureStore({
	reducer: reducers,
});

export type IState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
