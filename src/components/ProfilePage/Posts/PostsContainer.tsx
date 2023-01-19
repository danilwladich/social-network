import React, { useEffect, useLayoutEffect, useState } from "react";
import { Posts } from "./Posts";
import { IState } from "../../../models/IState";
import { connect } from "react-redux";
import {
	unlikePostTC,
	likePostTC,
	addPostTC,
	getPostsTC,
} from "../../../redux/profileReducer";
import { ProfilePostData } from "../../../models/Profile/ProfilePostData";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	userID: string;
	profileID: string;
	postsData: ProfilePostData[];
	pageSize: number;
	totalCount: number;
	getPostsTC: (userID: string, page: number, pageSize: number) => Promise<void>;
	addPostTC: (post: string) => Promise<void>;
	likePostTC: (userID: string, postID: number) => Promise<void>;
	unlikePostTC: (userID: string, postID: number) => Promise<void>;
}

export function PostsContainerAPI(props: IProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const pagesCount = Math.ceil(props.totalCount / props.pageSize);
	const pages: number[] = [];
	for (let i = 1; i <= pagesCount; i++) {
		pages.push(i);
	}

	useEffect(() => {
		function scrollHandler() {
			if (
				pagesCount > 0 &&
				currentPage !== pagesCount &&
				!isLoading &&
				window.pageYOffset >=
					document.documentElement.scrollHeight -
						Math.max(
							window.innerHeight,
							document.documentElement.clientHeight
						) *
							2
			) {
				setCurrentPage((prev) => prev + 1);
			}
		}
		window.addEventListener("scroll", scrollHandler);
		return () => window.removeEventListener("scroll", scrollHandler);
	});

	useLayoutEffect(() => {
		if (pagesCount > 0 && currentPage !== 1) {
			setIsLoading(true);
			props
				.getPostsTC(props.profileID, currentPage, props.pageSize)
				.finally(() => setIsLoading(false));
		}
		// eslint-disable-next-line
	}, [currentPage, props.pageSize]);

	return (
		<>
			<Posts
				userID={props.userID}
				profileID={props.profileID}
				postsData={props.postsData}
				addPostTC={props.addPostTC}
				likePostTC={props.likePostTC}
				unlikePostTC={props.unlikePostTC}
			/>

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
		userID: state.auth.user.id,
		profileID: state.profile.userData.id,
		postsData: state.profile.postsData,
		pageSize: state.profile.pageSize,
		totalCount: state.profile.totalCount,
	};
}

export const PostsContainer = connect(mapStateToProps, {
	getPostsTC,
	addPostTC,
	likePostTC,
	unlikePostTC,
})(PostsContainerAPI);
