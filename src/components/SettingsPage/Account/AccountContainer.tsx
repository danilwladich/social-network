import { connect } from "react-redux";
import { IState } from "../../../models/IState";
import { deleteAccountTC, logoutTC } from "../../../redux/authReducer";
import { Account } from "./Account";

function mapStateToProps(state: IState) {
	return {};
}

export const AccountContainer = connect(mapStateToProps, {
	logoutTC,
	deleteAccountTC,
})(Account);
