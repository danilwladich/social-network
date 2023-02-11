import { Header } from "./Header";
import { connect } from "react-redux";
import { IState } from "../../models/IState";
import { setBurger } from "./../../redux/headerReducer";

function mapStateToProps(state: IState) {
	return {
		isAuth: state.auth.isAuth,
		authNickname: state.auth.user.nickname,
		headerImage: state.header.headerImage,
		burger: state.header.burger,
		countOfUnreadMessages: state.messages.countOfUnreadMessages,
	};
}

export const HeaderContainer = connect(mapStateToProps, {
	setBurger,
})(Header);
