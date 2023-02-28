import React, { useState } from "react";
import { User } from "./User/User";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import { deleteChatTC } from "../../../../redux/reducers/messagesReducer";
import { useAppSelector } from "./../../../../hooks/useAppSelector";

export function Users() {
	const dispatch = useAppDispatch();

	const { usersData } = useAppSelector((state) => state.messages);
	const { bodyTheme } = useAppSelector((state) => state.settings);

	const [deleteButtonsInProgress, setDeleteButtonsInProgress] = useState<
		string[]
	>([]);

	async function deleteChat(userNickname: string) {
		setDeleteButtonsInProgress((prev) => [...prev, userNickname]);

		await dispatch(deleteChatTC(userNickname));

		setDeleteButtonsInProgress((prev) =>
			prev.filter((nickname) => nickname !== userNickname)
		);
	}

	return (
		<>
			{!!usersData.length ? (
				<div className="messages__users">
					{usersData.map((user) => (
						<User
							key={user.nickname}
							userData={user}
							deleteButtonInProgress={deleteButtonsInProgress.some(
								(nickname) => nickname === user.nickname
							)}
							bodyTheme={bodyTheme}
							deleteChat={() => deleteChat(user.nickname)}
						/>
					))}
				</div>
			) : (
				<div className="messages__users_no_users">You don't have chats yet</div>
			)}
		</>
	);
}
