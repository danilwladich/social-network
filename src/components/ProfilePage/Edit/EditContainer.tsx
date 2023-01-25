import { IState } from "../../../models/IState";
import { connect } from "react-redux";
import { Edit } from "./Edit";
import { editProfileTC } from "../../../redux/profileReducer";

function mapStateToProps(state: IState) {
	return {
		authID: state.auth.user.id,
		image: state.profile.userData.image,
		location: state.profile.aboutData.location,
	};
}

export const EditContainer = connect(mapStateToProps, {
	editProfileTC,
})(Edit);
