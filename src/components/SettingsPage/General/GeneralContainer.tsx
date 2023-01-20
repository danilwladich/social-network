import { connect } from "react-redux";
import { IState } from "../../../models/IState";
import { setTheme } from "../../../redux/settingsReducer";
import { General } from "./General";

function mapStateToProps(state: IState) {
	return {
		bodyTheme: state.settings.bodyTheme,
	};
}

export const GeneralContainer = connect(mapStateToProps, {
	setTheme,
})(General);
