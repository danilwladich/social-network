import React, { useState } from "react";
import { MessagesUserData } from "../../../models/Messages/MessagesUserData";
import { User } from "./User/User";

interface IProps {
	usersData: MessagesUserData[];
	deleteChatTC: (userNickname: string) => Promise<void>;
}

export function Users(props: IProps) {
	const [deleteButtonsInProgress, setDeleteButtonsInProgress] = useState<
		string[]
	>([]);

	function deleteChat(userNickname: string) {
		setDeleteButtonsInProgress((prev) => [...prev, userNickname]);
		props
			.deleteChatTC(userNickname)
			.finally(() =>
				setDeleteButtonsInProgress((prev) =>
					prev.filter((nickname) => nickname !== userNickname)
				)
			);
	}

	return (
		<>
			{!!props.usersData.length ? (
				<div className="messages__users">
					{props.usersData.map((u) => (
						<User
							key={u.nickname}
							userData={u}
							deleteButtonInProgress={deleteButtonsInProgress.some(
								(nickname) => nickname === u.nickname
							)}
							deleteChat={() => deleteChat(u.nickname)}
						/>
					))}
				</div>
			) : (
				<div className="messages__users_no_users">You don't have chats yet</div>
			)}
		</>
	);
}
