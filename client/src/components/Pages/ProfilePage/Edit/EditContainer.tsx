import { IState } from "../../../../models/IState";
import { connect } from "react-redux";
import { Edit } from "./Edit";
import { editProfileTC } from "../../../../redux/profileReducer";

function mapStateToProps(state: IState) {
	return {
		userData: state.profile.userData,
		authNickname: state.auth.user.nickname,
	};
}

export const EditContainer = connect(mapStateToProps, {
	editProfileTC,
})(Edit);
