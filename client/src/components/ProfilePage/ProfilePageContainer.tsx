import React, { useLayoutEffect, useState } from "react";
import { connect } from "react-redux";
import { IState } from "../../models/IState";
import { getProfileTC } from "../../redux/profileReducer";
import { ProfilePage } from "./ProfilePage";
import { Navigate, useParams } from "react-router-dom";
import { AuthRedirect } from "../../hoc/AuthRedirect";
import { compose } from "redux";
import { ProfilePageLoading } from "./ProfilePageLoading";

interface IProps {
	authNickname: string;
	userNickname: string;
	getProfileTC: (profileID: string) => Promise<void>;
}

function ProfilePageAPI(props: IProps) {
	document.title = `Bloxx`;
	const [isLoading, setIsLoading] = useState(false);
	const profileID = useParams().nickname;

	useLayoutEffect(() => {
		if (profileID) {
			setIsLoading(true);
			props.getProfileTC(profileID!).finally(() => setIsLoading(false));
		}
		// eslint-disable-next-line
	}, [profileID]);

	if (!profileID) {
		return <Navigate to={"/" + props.authNickname} />;
	}
	if (isLoading) {
		return <ProfilePageLoading />;
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

const ProfilePageContainer: any = compose(
	connect(mapStateToProps, {
		getProfileTC,
	}),
	AuthRedirect
)(ProfilePageAPI);

export default ProfilePageContainer;
