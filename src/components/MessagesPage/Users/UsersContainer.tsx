import React from "react";
import { IState } from "../../../models/IState";
import { connect } from "react-redux";
import { Users } from "./Users";
import { MessagesUserData } from "../../../models/Messages/MessagesUserData";

interface IProps {
	usersData: MessagesUserData[];
}

export function UsersContainerAPI(props: IProps) {
	return (
		<>
			<Users usersData={props.usersData} />
		</>
	);
}

function mapStateToProps(state: IState) {
	return {
		usersData: state.messages.usersData,
	};
}

export const UsersContainer = connect(mapStateToProps, {})(UsersContainerAPI);
