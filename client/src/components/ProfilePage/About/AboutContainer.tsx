import { connect } from "react-redux";
import { IState } from "../../../models/IState";
import { About } from "./About";

function mapStateToProps(state: IState) {
	return {
		aboutData: state.profile.aboutData,
		userNickname: state.profile.userData.nickname,
	};
}

export const AboutContainer = connect(mapStateToProps)(About);
