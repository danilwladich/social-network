import { connect } from "react-redux";
import { IState } from "../../models/IState";
import { NavBar } from "./NavBar";
import { setBurger } from "./../../redux/headerReducer";

function mapStateToProps(state: IState) {
	return {
		isAuth: state.auth.isAuth,
		authID: state.auth.user.id,
		burger: state.header.burger,
		countOfUnreadMessages: state.messages.countOfUnreadMessages,
	};
}

export const NavBarContainer = connect(mapStateToProps, {
	setBurger,
})(NavBar);
