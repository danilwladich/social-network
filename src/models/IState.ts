import { IProfile } from "./Profile/IProfile";
import { IMessages } from "./Messages/IMessages";
import { ISettings } from "./ISettings";
import { IUsers } from "./Users/IUsers";
import { IAuth } from "./IAuth";
import { IApp } from "./IApp";
import { IHeader } from "./IHeader";
import { IFriends } from "./Friends/IFriends";

export interface IState {
	app: IApp;
	auth: IAuth;
	header: IHeader;
	profile: IProfile;
	messages: IMessages;
	friends: IFriends;
	users: IUsers;
	settings: ISettings;
}
