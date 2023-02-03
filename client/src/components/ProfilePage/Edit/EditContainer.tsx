import { IState } from "../../../models/IState";
import { connect } from "react-redux";
import { Edit } from "./Edit";
import { editProfileTC } from "../../../redux/profileReducer";

function mapStateToProps(state: IState) {
	return {
		userData: state.profile.userData,
		authID: state.auth.user.id,
	};
}

export const EditContainer = connect(mapStateToProps, {
	editProfileTC,
})(Edit);
