import { connect } from "react-redux";
import { IState } from "../../../../models/IState";
import { About } from "./About";

function mapStateToProps(state: IState) {
	return {
		followData: state.profile.followData,
		userNickname: state.profile.userData.nickname,
		bodyTheme: state.settings.bodyTheme,
	};
}

export const AboutContainer = connect(mapStateToProps)(About);
