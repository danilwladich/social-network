import React, { useLayoutEffect, useState } from "react";
import { ProfilePage } from "./ProfilePage";
import { Navigate, useParams } from "react-router-dom";
import { ProfilePageLoading } from "./ProfilePageLoading";
import { useAppSelector } from "./../../../hooks/useAppSelector";
import { fetchProfileTC } from "../../../redux/reducers/profileReducer";
import { useAppDispatch } from "../../../hooks/useAppDispatch";

function ProfilePageAPI() {
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const { user: authUser } = useAppSelector((state) => state.auth);
	const { nickname: userNickname } = useAppSelector(
		(state) => state.profile.userData
	);

	const profileNickname = useParams().nickname;

	// fetching
	useLayoutEffect(() => {
		if (profileNickname) {
			setIsLoading(true);
			dispatch(fetchProfileTC(profileNickname)).finally(() => {
				setIsLoading(false);
			});
		}
	}, [profileNickname, dispatch]);

	if (!profileNickname) {
		if (!authUser.nickname) {
			return <Navigate to="/login" />;
		}
		return <Navigate to={"/" + authUser.nickname} />;
	}

	if (isLoading) {
		return <ProfilePageLoading itsMe={profileNickname === authUser.nickname} />;
	}

	if (!userNickname) {
		return (
			<section className="profile">
				<div className="subsection">
					<div className="profile__not_found">User not found</div>
				</div>
			</section>
		);
	}

	return (
		<>
			<ProfilePage />
		</>
	);
}

export default ProfilePageAPI;
