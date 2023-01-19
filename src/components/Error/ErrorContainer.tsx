import { connect } from "react-redux";
import { IState } from "../../models/IState";
import { setErrorMessage } from "../../redux/appReducer";
import { Error } from "./Error";

function mapStateToProps(state: IState) {
	return {
		errorMessage: state.app.errorMessage,
	};
}

export const ErrorContainer = connect(mapStateToProps, {
	setErrorMessage,
})(Error);
