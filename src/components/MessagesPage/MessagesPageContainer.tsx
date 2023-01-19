import { connect } from "react-redux";
import { IState } from "../../models/IState";
import { useParams } from "react-router-dom";
import { AuthRedirect } from "../../hoc/AuthRedirect";
import { compose } from "redux";
import { MessagesPage } from "./MessagesPage";

interface IProps {}

function MessagesPageAPI(props: IProps) {
	const userID = useParams().id;
	document.title = `Messages`;
	return (
		<>
			<MessagesPage userID={userID} />
		</>
	);
}

function mapStateToProps(state: IState) {
	return {};
}

const MessagesPageContainer = compose(
	connect(mapStateToProps, {}),
	AuthRedirect
)(MessagesPageAPI);

export default MessagesPageContainer;
