import {
	getUsersTC,
	setFollowTC,
	setUnfollowTC,
} from "../../../redux/usersReducer";
import { connect } from "react-redux";
import { IState } from "../../../models/IState";
import { UsersUserData } from "../../../models/Users/UsersUserData";
import { UsersPage } from "./UsersPage";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { UsersPageLoading } from "./UsersPageLoading";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

interface IProps {
	isAuth: boolean;
	usersData: UsersUserData[];
	pageSize: number;
	totalCount: number;
	bodyTheme: string;
	getUsersTC: (
		page: number,
		pageSize: number,
		search?: string
	) => Promise<void>;
	setFollowTC: (userNickname: string) => Promise<void>;
	setUnfollowTC: (userNickname: string) => Promise<void>;
}

function UsersPageAPI(props: IProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const query = useLocation().search.slice(1).replaceAll("&", " ").split(" ");
	const search = query.find((q) => q.split("=")[0] === "search")?.split("=")[1];

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
			.getUsersTC(currentPage, props.pageSize, search)
			.finally(() => setIsLoading(false));
		// eslint-disable-next-line
	}, [currentPage, props.pageSize, search]);

	if (isLoading && currentPage === 1) {
		return <UsersPageLoading />;
	}
	return (
		<>
			<Helmet>
				<title>Find users</title>
			</Helmet>

			<UsersPage {...props} isLoading={isLoading} search={search} />
		</>
	);
}

function mapStateToProps(state: IState) {
	return {
		isAuth: state.auth.isAuth,
		usersData: state.users.usersData,
		pageSize: state.users.pageSize,
		totalCount: state.users.totalCount,
		bodyTheme: state.settings.bodyTheme,
	};
}

const UsersPageContainer = connect(mapStateToProps, {
	getUsersTC,
	setFollowTC,
	setUnfollowTC,
})(UsersPageAPI);

export default UsersPageContainer;
