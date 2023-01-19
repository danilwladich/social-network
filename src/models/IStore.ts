import { ThunkMiddleware } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { IState } from "./IState";
import { IAction } from "./Action/IAction";

export type IStore = ToolkitStore<
	IState,
	IAction,
	[ThunkMiddleware<any, IAction, undefined>]
>;
