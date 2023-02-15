import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { MessagesUserData } from "../../../../models/Messages/MessagesUserData";
import { Actions } from "./Actions";
import { LastMessage } from "./LastMessage";

interface IProps {
	userData: MessagesUserData;
	deleteButtonInProgress: boolean;
	deleteChat: () => void;
}

const maxLeftPosition = -60;

export function User(props: IProps) {
	const userData = props.userData;
	const lastMessage = userData.lastMessage;

	const [relPostion, setRelPosition] = useState(0);
	const userRef = useRef<HTMLDivElement>(null);

	// set position
	function onTouchMoveHandler(e: React.TouchEvent<HTMLDivElement>) {
		const touchPosition = e.changedTouches[0].pageX;
		const position = touchPosition - relPostion;

		if (userRef.current !== null) {
			if (position < 0 && position >= maxLeftPosition) {
				userRef.current.style.translate = position + "px";
			}
			if (
				-position < 0 &&
				-position >= maxLeftPosition &&
				+userRef.current.style.translate.replace("px", "") < 0
			) {
				userRef.current.style.translate =
					+userRef.current.style.translate.replace("px", "") + position + "px";
			}
		}
	}
	function onTouchEndHandler(e: React.TouchEvent<HTMLDivElement>) {
		const touchPosition = e.changedTouches[0].pageX;
		const position = touchPosition - relPostion;

		if (userRef.current !== null) {
			if (position !== 0) {
				if (position >= maxLeftPosition / 2) {
					userRef.current.style.translate = "0px";
				} else {
					userRef.current.style.translate = maxLeftPosition + "px";
				}
			}
		}
	}

	return (
		<>
			<div
				className="messages__user"
				onTouchMove={(e) => onTouchMoveHandler(e)}
				onTouchEnd={(e) => onTouchEndHandler(e)}
				onTouchStart={(e) => setRelPosition(e.changedTouches[0].pageX)}
				ref={userRef}
			>
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
