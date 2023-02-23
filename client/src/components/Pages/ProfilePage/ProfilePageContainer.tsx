import React, { useLayoutEffect, useState } from "react";
import { connect } from "react-redux";
import { IState } from "../../../models/IState";
import { getProfileTC } from "../../../redux/profileReducer";
import { ProfilePage } from "./ProfilePage";
import { Navigate, useParams } from "react-router-dom";
import { ProfilePageLoading } from "./ProfilePageLoading";

interface IProps {
	authNickname: string;
	userNickname: string;
	getProfileTC: (profileNickname: string) => Promise<void>;
}

function ProfilePageAPI(props: IProps) {
	const [isLoading, setIsLoading] = useState(false);
	const profileNickname = useParams().nickname;

	useLayoutEffect(() => {
		if (profileNickname) {
			setIsLoading(true);
			props.getProfileTC(profileNickname!).finally(() => setIsLoading(false));
		}
		// eslint-disable-next-line
	}, [profileNickname]);

	if (!profileNickname) {
		if (!props.authNickname) {
			return <Navigate to="/login" />;
		}
		return <Navigate to={"/" + props.authNickname} />;
	}
	if (isLoading) {
		return (
			<ProfilePageLoading itsMe={profileNickname === props.authNickname} />
		);
	}
	if (!props.userNickname) {
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

function mapStateToProps(state: IState) {
	return {
		authNickname: state.auth.user.nickname,
		userNickname: state.profile.userData.nickname,
	};
}

const ProfilePageContainer = connect(mapStateToProps, {
	getProfileTC,
})(ProfilePageAPI);

export default ProfilePageContainer;
