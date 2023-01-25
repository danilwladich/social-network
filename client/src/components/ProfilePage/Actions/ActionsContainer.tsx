import { IState } from "../../../models/IState";
import { connect } from "react-redux";
import { Actions } from "./Actions";
import { setFollowTC, setUnfollowTC } from "../../../redux/usersReducer";

function mapStateToProps(state: IState) {
	return {
		authID: state.auth.user.id,
		userID: state.profile.userData.id,
		follower: state.profile.userData.follower,
		followed: state.profile.userData.followed,
	};
}

export const ActionsContainer = connect(mapStateToProps, {
	setFollowTC,
	setUnfollowTC,
})(Actions);
