import React, { useLayoutEffect, useState } from "react";
import { IState } from "../../../models/IState";
import { connect } from "react-redux";
import { Users } from "./Users";
import { MessagesUserData } from "../../../models/Messages/MessagesUserData";
import { getChatsTC } from "../../../redux/messagesReducer";
import { UsersLoading } from "./UsersLoading";

interface IProps {
	usersData: MessagesUserData[];
	getChatsTC: () => Promise<void>;
}

export function UsersContainerAPI(props: IProps) {
	const [isLoading, setIsLoading] = useState(false);

	useLayoutEffect(() => {
		setIsLoading(true);
		props.getChatsTC().finally(() => setIsLoading(false));
		// eslint-disable-next-line
	}, []);

	if (isLoading) {
		return <UsersLoading />;
	}
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

export const UsersContainer = connect(mapStateToProps, {
	getChatsTC,
})(UsersContainerAPI);
