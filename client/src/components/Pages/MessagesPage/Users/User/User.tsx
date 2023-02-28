import React from "react";
import { NavLink } from "react-router-dom";
import { MessagesUserData } from "../../../../../models/Messages/MessagesUserData";
import { Actions } from "./Actions";
import { LastMessage } from "./LastMessage";
import { UserOnline } from "./../../../../assets/UserOnline";

interface IProps {
	userData: MessagesUserData;
	deleteButtonInProgress: boolean;
	bodyTheme: string;
	deleteChat: () => void;
}

export function User(props: IProps) {
	const userData = props.userData;
	const lastMessage = userData.lastMessage;

	let userImage: string = `/images/user&theme=${props.bodyTheme}.jpg`;
	if (!!userData.image) {
		userImage = userData.image.split(".jpg")[0] + "&size=small.jpg";
	}

	return (
		<>
			<div
				className={
					"messages__user " +
					(!lastMessage.read && !lastMessage.out ? "unread" : "")
				}
			>
				<NavLink
					draggable="false"
					to={"/messages/" + userData.nickname}
					className="messages__user_content"
				>
					<div className="messages__user_image">
						<img loading="lazy" src={userImage} alt={userData.nickname} />

						<UserOnline
							className="messages__user_online"
							online={userData.online}
							small
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
					firstName={userData.firstName}
					deleteButtonInProgress={props.deleteButtonInProgress}
					deleteChat={props.deleteChat}
				/>
			</div>
		</>
	);
}
