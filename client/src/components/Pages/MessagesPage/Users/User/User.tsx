import React from "react";
import { NavLink } from "react-router-dom";
import { MessagesUserData } from "../../../../../models/Messages/MessagesUserData";
import { Actions } from "./Actions";
import { LastMessage } from "./LastMessage";

interface IProps {
	userData: MessagesUserData;
	deleteButtonInProgress: boolean;
	deleteChat: () => void;
}

export function User(props: IProps) {
	const userData = props.userData;
	const lastMessage = userData.lastMessage;
	return (
		<>
			<div className="messages__user">
				<NavLink
					draggable="false"
					to={"/messages/" + userData.nickname}
					className={
						"messages__user_content " +
						(!lastMessage.read && !lastMessage.out ? "unread" : "")
					}
				>
					<div
						className={
							"messages__user_image " + (userData.online ? "online" : "")
						}
					>
						<img
							loading="lazy"
							src={userData.image || "/images/user.jpg"}
							alt={userData.nickname}
						/>
					</div>
					<div className="messages__user_info">
						<div className="messages__user_name">
							{userData.firstName + " " + userData.lastName}
						</div>
						<LastMessage lastMessage={lastMessage} />
					</div>
				</NavLink>

				<Actions
					deleteButtonInProgress={props.deleteButtonInProgress}
					deleteChat={props.deleteChat}
				/>
			</div>
		</>
	);
}
