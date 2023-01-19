import { connect } from "react-redux";
import { IState } from "../../../models/IState";
import { About } from "./About";

function mapStateToProps(state: IState) {
	return {
		aboutData: state.profile.aboutData,
		userID: state.profile.userData.id,
	};
}

export const AboutContainer = connect(mapStateToProps)(About);
