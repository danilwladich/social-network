import React, { useState } from "react";
import { EditContainer } from "../Edit/EditContainer";
import { NavLink } from "react-router-dom";
import { LoadingCircle } from "../../assets/LoadingCircle";
import { ProfileUserData } from "../../../models/Profile/ProfileUserData";

interface IProps {
	authID: string;
	userData: ProfileUserData;
	setFollowTC: (userID: string) => Promise<void>;
	setUnfollowTC: (userID: string) => Promise<void>;
}

export function Actions(props: IProps) {
	const userData = props.userData;
	const [followButtonInProgress, setFollowButtonInProgress] = useState(false);

	function setFollow() {
		setFollowButtonInProgress(true);
		props.setFollowTC(userData.id).then(() => setFollowButtonInProgress(false));
	}
	function setUnfollow() {
		setFollowButtonInProgress(true);
		props
			.setUnfollowTC(userData.id)
			.then(() => setFollowButtonInProgress(false));
	}
	return (
		<>
			<div className="profile__actions">
				{props.authID === userData.id ? (
					<EditContainer />
				) : (
					<>
						<NavLink
							draggable="false"
							to={"/messages/" + userData.id}
							className="profile__actions_message"
						>
							Message
						</NavLink>
						<button
							onClick={() => {
								userData.followed ? setUnfollow() : setFollow();
							}}
							disabled={followButtonInProgress}
							className="profile__actions_follow"
						>
							{followButtonInProgress ? (
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
					</>
				)}
			</div>
		</>
	);
}
