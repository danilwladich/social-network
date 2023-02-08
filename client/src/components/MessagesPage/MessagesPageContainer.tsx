import { AuthRedirect } from "../../hoc/AuthRedirect";
import { compose } from "redux";
import { MessagesPage } from "./MessagesPage";
import { connect } from "react-redux";
import { IState } from "../../models/IState";
import {
	messageSent,
	messagesRead,
	readMessages,
} from "./../../redux/messagesReducer";

function mapStateToProps(state: IState) {
	return {};
}

const MessagesPageContainer = compose(
	connect(mapStateToProps, {
		messageSent,
		messagesRead,
		readMessages,
	}),
	AuthRedirect
)(MessagesPage);

export default MessagesPageContainer;
