import { AuthRedirect } from "../../hoc/AuthRedirect";
import { compose } from "redux";
import { MessagesPage } from "./MessagesPage";

const MessagesPageContainer = compose(
	AuthRedirect
)(MessagesPage);

export default MessagesPageContainer;
