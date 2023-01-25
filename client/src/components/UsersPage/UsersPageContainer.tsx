import {
	getUsersTC,
	setFollowTC,
	setUnfollowTC,
} from "../../redux/usersReducer";
import { connect } from "react-redux";
import { compose } from "redux";
import { IState } from "../../models/IState";
import { UsersUserData } from "../../models/Users/UsersUserData";
import { UsersPage } from "./UsersPage";
import { useEffect, useState } from "react";
import { AuthRedirect } from "../../hoc/AuthRedirect";
import { UsersPageLoading } from "./UsersPageLoading";

interface IProps {
	usersData: UsersUserData[];
	pageSize: number;
	totalCount: number;
	getUsersTC: (page: number, pageSize: number) => Promise<void>;
	setFollowTC: (userID: string) => Promise<void>;
	setUnfollowTC: (userID: string) => Promise<void>;
}

function UsersPageAPI(props: IProps) {
	document.title = `Find users`;
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setIsLoading(true);
		props
			.getUsersTC(currentPage, props.pageSize)
			.finally(() => setIsLoading(false));
		// eslint-disable-next-line
	}, [currentPage, props.pageSize]);

	function pageChanged(page: number) {
		window.scrollTo(0, 0);
		setCurrentPage(page);
	}

	if (isLoading) {
		return <UsersPageLoading />;
	}
	return (
		<>
			<UsersPage
				{...props}
				currentPage={currentPage}
				pageChanged={pageChanged}
			/>
		</>
	);
}

function mapStateToProps(state: IState) {
	return {
		usersData: state.users.usersData,
		pageSize: state.users.pageSize,
		totalCount: state.users.totalCount,
	};
}

const UsersPageContainer = compose(
	connect(mapStateToProps, {
		getUsersTC,
		setFollowTC,
		setUnfollowTC,
	}),
	AuthRedirect
)(UsersPageAPI);

export default UsersPageContainer;
