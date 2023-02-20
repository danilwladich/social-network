import React, { useEffect, useLayoutEffect, useState } from "react";
import { connect } from "react-redux";
import { IState } from "../../../models/IState";
import { AuthRedirect } from "../../../hoc/AuthRedirect";
import { compose } from "redux";
import { NewsPage } from "./NewsPage";
import { likePostTC, unlikePostTC } from "./../../../redux/profileReducer";
import { NewsPostData } from "../../../models/News/NewsPostData";
import { getNewsTC } from "./../../../redux/newsReducer";
import { NewsPageLoading } from "./NewsPageLoading";

interface IProps {
	postsData: NewsPostData[];
	pageSize: number;
	totalCount: number;
	bodyTheme: string;
	getNewsTC: (page: number, pageSize: number) => Promise<void>;
	likePostTC: (postID: string) => Promise<void>;
	unlikePostTC: (postID: string) => Promise<void>;
}

function NewsPageAPI(props: IProps) {
	document.title = `News`;
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
		props.getNewsTC(currentPage, props.pageSize).finally(() => {
			setIsLoading(false);
		});
		// eslint-disable-next-line
	}, [currentPage, props.pageSize]);

	if (isLoading && currentPage === 1) {
		return <NewsPageLoading />;
	}
	return (
		<>
			<NewsPage {...props} isLoading={isLoading} />
		</>
	);
}

function mapStateToProps(state: IState) {
	return {
		postsData: state.news.postsData,
		pageSize: state.news.pageSize,
		totalCount: state.news.totalCount,
		bodyTheme: state.settings.bodyTheme,
	};
}

const NewsPageContainer: any = compose(
	connect(mapStateToProps, {
		getNewsTC,
		likePostTC,
		unlikePostTC,
	}),
	AuthRedirect
)(NewsPageAPI);

export default NewsPageContainer;
