import React, { useState } from "react";
import { EditContainer } from "./Edit/EditContainer";
import { NavLink, useNavigate } from "react-router-dom";
import { LoadingCircle } from "../../../assets/LoadingCircle";
import { ProfileUserData } from "../../../../models/Profile/ProfileUserData";

interface IProps {
	authNickname: string;
	userData: ProfileUserData;
	setFollowTC: (userNickname: string) => Promise<void>;
	setUnfollowTC: (userNickname: string) => Promise<void>;
}

export function Actions(props: IProps) {
	const navigate = useNavigate();
	const [followButtonInProgress, setFollowButtonInProgress] = useState(false);
	const userData = props.userData;

	function setFollow() {
		setFollowButtonInProgress(true);
		props
			.setFollowTC(userData.nickname)
			.then(() => setFollowButtonInProgress(false));
	}
	function setUnfollow() {
		setFollowButtonInProgress(true);
		props
			.setUnfollowTC(userData.nickname)
			.then(() => setFollowButtonInProgress(false));
	}

	function onFollowClickHandler() {
		if (!props.authNickname) {
			return navigate("/login");
		}
		if (userData.followed) {
			setUnfollow();
		} else {
			setFollow();
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
			<div className="profile__actions">
				{props.authNickname === userData.nickname ? (
					<EditContainer />
				) : (
					<>
						<NavLink
							draggable="false"
							to={
								!props.authNickname
									? "/login"
									: "/messages/" + userData.nickname
							}
							className="profile__actions_message"
						>
							Message
						</NavLink>
						<button
							onClick={() => onFollowClickHandler()}
							disabled={followButtonInProgress}
							className="profile__actions_follow"
						>
							{followButtonInProgress ? <LoadingCircle /> : followButtonText}
						</button>
					</>
				)}
			</div>
		</>
	);
}
