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
import React, { useEffect, useState, useLayoutEffect } from "react";
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

	const pagesCount = Math.ceil(props.totalCount / props.pageSize);
	const pages: number[] = [];
	for (let i = 1; i <= pagesCount; i++) {
		pages.push(i);
	}

	// pagination
	useEffect(() => {
		window.addEventListener("scroll", scrollHandler);
		return () => window.removeEventListener("scroll", scrollHandler);
		// eslint-disable-next-line
	}, [isLoading, currentPage, pagesCount]);
	function scrollHandler() {
		if (
			pagesCount > 0 &&
			currentPage !== pagesCount &&
			!isLoading &&
			window.pageYOffset >=
				document.documentElement.scrollHeight -
					Math.max(window.innerHeight, document.documentElement.clientHeight) *
						2
		) {
			setCurrentPage((prev) => prev + 1);
		}
	}

	useLayoutEffect(() => {
		setIsLoading(true);
		props
			.getUsersTC(currentPage, props.pageSize)
			.finally(() => setIsLoading(false));
		// eslint-disable-next-line
	}, [currentPage, props.pageSize]);

	if (isLoading && currentPage === 1) {
		return <UsersPageLoading />;
	}
	return (
		<>
			<UsersPage {...props} isLoading={isLoading} />
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
