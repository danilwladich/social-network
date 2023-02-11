import { IState } from "../../../models/IState";
import { connect } from "react-redux";
import { Actions } from "./Actions";
import { setFollowTC, setUnfollowTC } from "../../../redux/usersReducer";

function mapStateToProps(state: IState) {
	return {
		authNickname: state.auth.user.nickname,
		userData: state.profile.userData,
	};
}

export const ActionsContainer = connect(mapStateToProps, {
	setFollowTC,
	setUnfollowTC,
})(Actions);
