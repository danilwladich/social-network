import React, { useState } from "react";
import { Edit } from "./Edit/Edit";
import { NavLink, useNavigate } from "react-router-dom";
import { LoadingCircle } from "../../../assets/svg/LoadingCircle";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import {
	setFollowTC,
	setUnfollowTC,
} from "../../../../redux/reducers/profileReducer";

export function Actions() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [isLoading, setIsLoading] = useState(false);

	const { user: authUser } = useAppSelector((state) => state.auth);
	const { userData } = useAppSelector((state) => state.profile);

	async function onFollowButtonClickHandler() {
		if (!authUser.nickname) {
			return navigate("/login");
		}

		setIsLoading(true);
		if (userData.followed) {
			await dispatch(setUnfollowTC(userData.nickname));
		} else {
			await dispatch(setFollowTC(userData.nickname));
		}
		setIsLoading(false);
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
				{authUser.nickname === userData.nickname ? (
					<Edit />
				) : (
					<>
						<NavLink
							draggable="false"
							to={
								!authUser.nickname ? "/login" : "/messages/" + userData.nickname
							}
							className="profile__actions_message"
						>
							Message
						</NavLink>
						<button
							onClick={() => onFollowButtonClickHandler()}
							disabled={isLoading}
							className="profile__actions_follow"
						>
							{isLoading ? <LoadingCircle /> : followButtonText}
						</button>
					</>
				)}
			</div>
		</>
	);
}
