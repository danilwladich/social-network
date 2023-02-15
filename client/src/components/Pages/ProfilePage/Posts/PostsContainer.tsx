import React, { useEffect, useLayoutEffect, useState } from "react";
import { Posts } from "./Posts";
import { IState } from "../../../../models/IState";
import { connect } from "react-redux";
import {
	unlikePostTC,
	likePostTC,
	addPostTC,
	getPostsTC,
	deletePostTC,
} from "../../../../redux/profileReducer";
import { ProfilePostData } from "../../../../models/Profile/ProfilePostData";
import { LoadingCircle } from "../../../assets/LoadingCircle";

interface IProps {
	authNickname: string;
	userNickname: string;
	postsData: ProfilePostData[];
	pageSize: number;
	totalCount: number;
	getPostsTC: (
		userNickname: string,
		page: number,
		pageSize: number
	) => Promise<void>;
	addPostTC: (post: string) => Promise<void>;
	deletePostTC: (postID: string) => Promise<void>;
	likePostTC: (postID: string) => Promise<void>;
	unlikePostTC: (postID: string) => Promise<void>;
}

export function PostsContainerAPI(props: IProps) {
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
		if (pagesCount > 0 && currentPage !== 1) {
			setIsLoading(true);
			props
				.getPostsTC(props.userNickname, currentPage, props.pageSize)
				.finally(() => setIsLoading(false));
		}
		// eslint-disable-next-line
	}, [currentPage, props.pageSize]);

	return (
		<>
			<Posts {...props} />

			{isLoading && (
				<div className="profile__posts_loading">
					<LoadingCircle />
				</div>
			)}
		</>
	);
}

function mapStateToProps(state: IState) {
	return {
		authNickname: state.auth.user.nickname,
		userNickname: state.profile.userData.nickname,
		postsData: state.profile.postsData,
		pageSize: state.profile.pageSize,
		totalCount: state.profile.totalCount,
	};
}

export const PostsContainer = connect(mapStateToProps, {
	getPostsTC,
	addPostTC,
	deletePostTC,
	likePostTC,
	unlikePostTC,
})(PostsContainerAPI);
