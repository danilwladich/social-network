import React, { useState } from "react";
import { EditContainer } from "../Edit/EditContainer";
import { NavLink } from "react-router-dom";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	authID: string;
	userID: string;
	follower?: boolean;
	followed?: boolean;
	setFollowTC: (userID: string) => Promise<void>;
	setUnfollowTC: (userID: string) => Promise<void>;
}

export function Actions(props: IProps) {
	const [followButtonInProgress, setFollowButtonInProgress] = useState(false);

	function setFollow() {
		setFollowButtonInProgress(true);
		props
			.setFollowTC(props.userID)
			.then(() => setFollowButtonInProgress(false));
	}
	function setUnfollow() {
		setFollowButtonInProgress(true);
		props
			.setUnfollowTC(props.userID)
			.then(() => setFollowButtonInProgress(false));
	}
	return (
		<>
			<div className="profile__actions">
				{props.authID === props.userID ? (
					<EditContainer />
				) : (
					<>
						<NavLink
							draggable="false"
							to={"/messages/" + props.userID}
							className="profile__actions_message"
						>
							Message
						</NavLink>
						<button
							onClick={() => {
								props.followed ? setUnfollow() : setFollow();
							}}
							disabled={followButtonInProgress}
							className="profile__actions_follow"
						>
							{followButtonInProgress ? (
								<LoadingCircle />
							) : props.follower && props.followed ? (
								"Unfriend"
							) : props.followed ? (
								"Followed"
							) : props.follower ? (
								"Accept request"
							) : (
								"Add friend"
							)}
						</button>
					</>
				)}
			</div>
		</>
	);
}
