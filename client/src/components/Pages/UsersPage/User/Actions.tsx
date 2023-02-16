import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsersUserData } from "../../../../models/Users/UsersUserData";
import { LoadingCircle } from "../../../assets/LoadingCircle";

interface IProps {
	isAuth: boolean;
	userData: UsersUserData;
	followButtonInProgress: boolean;
	setFollow: () => void;
	setUnfollow: () => void;
}

export function Actions(props: IProps) {
	const navigate = useNavigate();
	const [showActions, setShowActions] = useState(false);
	const userData = props.userData;

	function onFollowClickHandler() {
		if (!props.isAuth) {
			return navigate("/login");
		}
		if (userData.followed) {
			props.setUnfollow();
		} else {
			props.setFollow();
		}
	}

	const followButtonText =
		userData.follower && userData.followed
			? "Unfriend"
			: userData.followed
			? "Followed"
			: userData.follower
			? "Accept request"
			: "Add friend";

	return (
		<>
			<div
				onMouseEnter={() => setShowActions(true)}
				onMouseLeave={() => setShowActions(false)}
				className="users_user_actions"
			>
				<button
					onClick={() => {
						showActions ? setShowActions(false) : setShowActions(true);
					}}
					className="users__user_actions_show"
				>
					<span></span>
				</button>

				<button
					onClick={() => onFollowClickHandler()}
					disabled={props.followButtonInProgress}
					className={
						"users__user_actions_follow " + (showActions ? "active" : "")
					}
				>
					{props.followButtonInProgress ? <LoadingCircle /> : followButtonText}
				</button>
			</div>
		</>
	);
}
