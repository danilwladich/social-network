import React from "react";
import { MessagesUserData } from "../../../models/Messages/MessagesUserData";
import { User } from "./User";

interface IProps {
	usersData: MessagesUserData[];
}

export function Users(props: IProps) {
	return (
		<>
			<h2 className="messages__title title">Your chats</h2>
			<div className="messages__users">
				{props.usersData.map((u) => (
					<User key={u.id} userData={u} />
				))}
			</div>
		</>
	);
}
