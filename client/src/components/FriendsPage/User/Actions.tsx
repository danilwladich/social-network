import React, { useState } from "react";
import { FriendsUserData } from "../../../models/Friends/FriendsUserData";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	userData: FriendsUserData;
	followButtonInProgress: boolean;
	setFollow: () => void;
	setUnfollow: () => void;
}

export function Actions(props: IProps) {
	const [showActions, setShowActions] = useState(false);
	const userData = props.userData;
	return (
		<>
			<div
				onMouseEnter={() => setShowActions(true)}
				onMouseLeave={() => setShowActions(false)}
				className="friends_user_actions"
			>
				<button
					onClick={() => {
						showActions ? setShowActions(false) : setShowActions(true);
					}}
					className="friends__user_actions_show"
				>
					<span></span>
				</button>

				<button
					onClick={() => {
						userData.followed ? props.setUnfollow() : props.setFollow();
					}}
					disabled={props.followButtonInProgress}
					className={"friends__user_actions_follow " + (showActions ? "active" : "")}
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
			</div>
		</>
	);
}
