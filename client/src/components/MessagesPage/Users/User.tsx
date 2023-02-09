import React from "react";
import { NavLink } from "react-router-dom";
import { MessagesUserData } from "../../../models/Messages/MessagesUserData";
import { CheckMark } from "../../assets/CheckMark";

interface IProps {
	userData: MessagesUserData;
}

export function User(props: IProps) {
	const userData = props.userData;
	const lastMessage = userData.lastMessage;

	const date = lastMessage.date.split(" ");
	const dateNow = new Date().toString().split(" ").slice(1, 5);
	const dateToShow =
		date[0] === dateNow[0] && date[2] === dateNow[2]
			? date[0] === dateNow[0]
				? date[3].slice(0, 5)
				: date[0] + " " + date[1]
			: date[1] + " " + date[0] + " " + date[2];

	return (
		<>
			<NavLink
				to={"/messages/" + userData.id}
				draggable="false"
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
						alt={userData.id}
					/>
				</div>

				<div className="messages__user_info">
					<div className="messages__user_name">
						{userData.firstName + " " + userData.lastName}
					</div>

					<div className="messages__user_lastmessage">
						<div className="messages__user_lastmessage_text">
							{(lastMessage.out ? "Me: " : "") + lastMessage.message}
						</div>

						{lastMessage.out && (
							<div
								className={
									"messages__user_lastmessage_status " +
									(lastMessage.read ? "read" : "")
								}
							>
								{lastMessage.id.includes("temporaryid") ? (
									<CheckMark />
								) : (
									<>
										<CheckMark />
										<CheckMark />
									</>
								)}
							</div>
						)}
						<div className="messages__user_lastmessage_date">{dateToShow}</div>
					</div>
				</div>
			</NavLink>
		</>
	);
}
