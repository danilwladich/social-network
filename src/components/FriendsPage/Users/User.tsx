import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FriendsUserData } from "../../../models/Friends/FriendsUserData";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	itsMe: boolean;
	userData: FriendsUserData;
	followButtonInProgress: boolean;
	setFollow: () => void;
	setUnfollow: () => void;
}

export function User(props: IProps) {
	const [showActions, setShowActions] = useState(false);
	const userData = props.userData;
	return (
		<>
			<div className="friends__user">
				<NavLink
					to={"/" + userData.id}
					draggable="false"
					className="friends__user_image"
				>
					<img
						loading="lazy"
						src={userData.image || "/images/user.jpg"}
						alt={userData.id}
					/>
				</NavLink>
				<div className="friends__user_info">
					<div className="friends__user_name">
						<NavLink draggable="false" to={"/" + userData.id}>
							{userData.firstName + " " + userData.lastName}
						</NavLink>
					</div>

					<div className="friends__user_location">
						<p>{userData.location.country}</p>
						<p>{userData.location.city}</p>
					</div>
				</div>

				{!props.itsMe ? (
					<div
						onMouseEnter={() => setShowActions(true)}
						onMouseLeave={() => setShowActions(false)}
						className="friends_user_actions"
					>
						<button
							onClick={() => {
								userData.followed ? props.setUnfollow() : props.setFollow();
							}}
							disabled={props.followButtonInProgress}
							className={
								"friends__user_follow " + (showActions ? "active" : "")
							}
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
							className="friends__user_showactions"
						>
							<span></span>
						</button>
					</div>
				) : <div className="friends__user_itsme">Me</div>}
			</div>
		</>
	);
}
