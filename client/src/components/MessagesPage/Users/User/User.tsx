import React, { useState } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { NavLink, useNavigate } from "react-router-dom";
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
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const navigate = useNavigate();
	const userData = props.userData;
	const lastMessage = userData.lastMessage;

	// set position
	function onStopHander(e: DraggableEvent, position: DraggableData) {
		const { x } = position;
		if (x < maxLeftPosition / 2) {
			setPosition({ x: maxLeftPosition, y: 0 });
		} else {
			setPosition({ x: 0, y: 0 });

			// navigate for mobile
			if (e.type === "touchend") {
				navigate("/messages/" + userData.nickname);
			}
		}
	}

	// prevent if dragged
	function onClickHandler(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		if (position.x !== 0) {
			e.preventDefault();
		}
	}
	return (
		<>
			<Draggable
				axis="x"
				bounds={{ left: maxLeftPosition, right: 0, top: 0, bottom: 0 }}
				onStop={(e, position) => onStopHander(e, position)}
				position={position}
			>
				<NavLink
					onClick={(e) => onClickHandler(e)}
					draggable="false"
					to={"/messages/" + userData.nickname}
					className={
						"messages__user " +
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

					<Actions
						deleteButtonInProgress={props.deleteButtonInProgress}
						deleteChat={props.deleteChat}
					/>
				</NavLink>
			</Draggable>
		</>
	);
}
