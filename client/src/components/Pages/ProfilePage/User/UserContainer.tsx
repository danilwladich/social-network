import { connect } from "react-redux";
import { IState } from "../../../../models/IState";
import { User } from "./User";

function mapStateToProps(state: IState) {
	return {
		userData: state.profile.userData,
	};
}

export const UserContainer = connect(mapStateToProps)(User);
