import { connect } from "react-redux";
import { RegisterPage } from "./RegisterPage";
import { registerTC } from "../../../redux/authReducer";
import { IState } from "../../../models/IState";

function mapStateToProps(state: IState) {
	return {
		isAuth: state.auth.isAuth,
		authID: state.auth.user.id,
	};
}

const RegisterPageContainer = connect(mapStateToProps, {
	registerTC,
})(RegisterPage);

export default RegisterPageContainer;
