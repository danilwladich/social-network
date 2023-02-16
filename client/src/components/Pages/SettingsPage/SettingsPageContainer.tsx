import { SettingsPage } from "./SettingsPage";
import { connect } from "react-redux";
import { IState } from "../../../models/IState";

function mapStateToProps(state: IState) {
	return {
		isAuth: state.auth.isAuth,
	};
}

const SettingsPageContainer = connect(mapStateToProps, {})(SettingsPage);

export default SettingsPageContainer;
