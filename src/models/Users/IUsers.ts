import { UsersUserData } from "./UsersUserData";

export interface IUsers {
	usersData: UsersUserData[];
	pageSize: number;
	totalCount: number;
}
