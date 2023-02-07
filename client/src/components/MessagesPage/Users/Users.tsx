import React from "react";
import { MessagesUserData } from "../../../models/Messages/MessagesUserData";
import { User } from "./User";

interface IProps {
	usersData: MessagesUserData[];
}

export function Users(props: IProps) {
	return (
		<>
			{!!props.usersData.length ? (
				<div className="messages__users">
					{props.usersData.map((u) => (
						<User key={u.id} userData={u} />
					))}
				</div>
			) : (
				<div className="messages__users_no_users">You don't have chats yet</div>
			)}
		</>
	);
}
