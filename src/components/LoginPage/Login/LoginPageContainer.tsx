import { connect } from "react-redux";
import { IState } from "../../../models/IState";
import { loginTC } from "../../../redux/authReducer";
import { LoginPage } from "./LoginPage";

function mapStateToProps(state: IState) {
	return {
		isAuth: state.auth.isAuth,
		authID: state.auth.user.id,
	};
}

const LoginPageContainer = connect(mapStateToProps, {
	loginTC,
})(LoginPage);

export default LoginPageContainer;
