import { IState } from "../../../models/IState";
import { connect } from "react-redux";
import { Actions } from "./Actions";
import { setFollowTC, setUnfollowTC } from "../../../redux/usersReducer";

function mapStateToProps(state: IState) {
	return {
		authID: state.auth.user.id,
		userData: state.profile.userData,
	};
}

export const ActionsContainer = connect(mapStateToProps, {
	setFollowTC,
	setUnfollowTC,
})(Actions);
