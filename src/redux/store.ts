import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { messagesReducer } from "./messagesReducer";
import { profileReducer } from "./profileReducer";
import { settingsReducer } from "./settingsReducer";
import { IStore } from "../models/IStore";
import { usersReducer } from "./usersReducer";
import { authReducer } from "./authReducer";
import { appReducer } from "./appReducer";
import { headerReducer } from "./headerReducer";
import { friendsReducer } from "./friendsReducer";

const reducers = combineReducers({
	app: appReducer,
	header: headerReducer,
	auth: authReducer,
	profile: profileReducer,
	messages: messagesReducer,
	friends: friendsReducer,
	users: usersReducer,
	settings: settingsReducer,
});

export const store: IStore = configureStore({ reducer: reducers });
