import React from "react";
import { NavLink } from "react-router-dom";
import { UsersUserData } from "../../../../models/Users/UsersUserData";
import { Actions } from "./Actions";

interface IProps {
	userData: UsersUserData;
	followButtonInProgress: boolean;
	setFollow: () => void;
	setUnfollow: () => void;
}

export function User(props: IProps) {
	const userData = props.userData;
	return (
		<>
			<div className="users__user">
				<NavLink
					to={"/" + userData.nickname}
					draggable="false"
					className={"users__user_image " + (userData.online ? "online" : "")}
				>
					<img
						loading="lazy"
						src={userData.image || "/images/user.jpg"}
						alt={userData.nickname}
					/>
				</NavLink>

				<div className="users__user_info">
					<div className="users__user_name">
						<NavLink draggable="false" to={"/" + userData.nickname}>
							{userData.firstName + " " + userData.lastName}
						</NavLink>
					</div>

					<div className="users__user_location">
						<p>{userData.location.country}</p>
						<p>{userData.location.city}</p>
					</div>
				</div>

				<Actions {...props} />
			</div>
		</>
	);
}
