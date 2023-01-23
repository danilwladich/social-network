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
	authID: string;
	userID: string;
	getProfileTC: (profileID: string) => Promise<void>;
}

function ProfilePageAPI(props: IProps) {
	document.title = `SocNet`;
	const [isLoading, setIsLoading] = useState(false);
	let profileID = useParams().id;

	useLayoutEffect(() => {
		if (profileID) {
			setIsLoading(true);
			props.getProfileTC(profileID!).finally(() => setIsLoading(false));
		}
		// eslint-disable-next-line
	}, [profileID]);

	if (!profileID) {
		return <Navigate to={"/" + props.authID} />;
	}
	if (isLoading) {
		return (
			<>
				<ProfilePageLoading />
			</>
		);
	} else if (!props.userID) {
		return (
			<section className="profile">
				<div className="subsection">
					<div className="profile__not_found">User not found</div>
				</div>
			</section>
		);
	} else {
		return (
			<>
				<ProfilePage />
			</>
		);
	}
}

function mapStateToProps(state: IState) {
	return {
		authID: state.auth.user.id,
		userID: state.profile.userData.id,
	};
}

const ProfilePageContainer: any = compose(
	connect(mapStateToProps, {
		getProfileTC,
	}),
	AuthRedirect
)(ProfilePageAPI);

export default ProfilePageContainer;
