import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { UsersUserData } from "../../../models/Users/UsersUserData";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	userData: UsersUserData;
	followButtonInProgress: boolean;
	setFollow: () => void;
	setUnfollow: () => void;
}

export function User(props: IProps) {
	const [showActions, setShowActions] = useState(false);
	const userData = props.userData;
	return (
		<>
			<div className="users__user">
				<NavLink
					to={"/" + userData.id}
					draggable="false"
					className="users__user_image"
				>
					<img
						loading="lazy"
						src={userData.image || "/images/user.jpg"}
						alt={userData.id}
					/>
				</NavLink>
				<div className="users__user_info">
					<div className="users__user_name">
						<NavLink draggable="false" to={"/" + userData.id}>
							{userData.firstName + " " + userData.lastName}
						</NavLink>
					</div>

					<div className="users__user_location">
						<p>{userData.location.country}</p>
						<p>{userData.location.city}</p>
					</div>
				</div>

				<div
					onMouseEnter={() => setShowActions(true)}
					onMouseLeave={() => setShowActions(false)}
					className="users_user_actions"
				>
					<button
						onClick={() => {
							userData.followed ? props.setUnfollow() : props.setFollow();
						}}
						disabled={props.followButtonInProgress}
						className={"users__user_follow " + (showActions ? "active" : "")}
					>
						{props.followButtonInProgress ? (
							<LoadingCircle />
						) : userData.follower && userData.followed ? (
							"Unfriend"
						) : userData.followed ? (
							"Followed"
						) : userData.follower ? (
							"Accept request"
						) : (
							"Add friend"
						)}
					</button>

					<button
						onClick={() => {
							showActions ? setShowActions(false) : setShowActions(true);
						}}
						className="users__user_showactions"
					>
						<span></span>
					</button>
				</div>
			</div>
		</>
	);
}
