import { Header } from "./Header";
import { connect } from "react-redux";
import { IState } from "../../models/IState";
import { setBurger } from "./../../redux/headerReducer";

function mapStateToProps(state: IState) {
	return {
		isAuth: state.auth.isAuth,
		authID: state.auth.user.id,
		headerImage: state.header.headerImage,
		burger: state.header.burger,
	};
}

export const HeaderContainer = connect(mapStateToProps, {
	setBurger,
})(Header);
