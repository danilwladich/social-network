import React, { useEffect, useLayoutEffect, useState } from "react";
import { Posts } from "./Posts";
import { LoadingCircle } from "../../../assets/svg/LoadingCircle";
import { useAppSelector } from "./../../../../hooks/useAppSelector";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import { fetchPostsTC } from "../../../../redux/reducers/profileReducer";

export function PostsContainerAPI() {
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const { pageSize, totalCount } = useAppSelector((state) => state.profile);
	const { nickname: userNickname } = useAppSelector(
		(state) => state.profile.userData
	);

	const pagesCount = Math.ceil(totalCount / pageSize);
	const pages: number[] = [];
	for (let i = 1; i <= pagesCount; i++) {
		pages.push(i);
	}

	// pagination
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
	}, [isLoading, currentPage, pagesCount]);

	// fetching
	useLayoutEffect(() => {
		if (pagesCount > 0 && currentPage !== 1) {
			setIsLoading(true);
			dispatch(
				fetchPostsTC({
					userNickname: userNickname,
					page: currentPage,
					pageSize,
				})
			).finally(() => setIsLoading(false));
		}
	}, [currentPage, pageSize, dispatch, pagesCount, userNickname]);

	return (
		<>
			<Posts />

			{isLoading && (
				<div className="profile__posts_loading">
					<LoadingCircle />
				</div>
			)}
		</>
	);
}

export default PostsContainerAPI;
