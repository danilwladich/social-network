import React, { useEffect, useLayoutEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { FriendsPage } from "./FriendsPage";
import { FriendsPageLoading } from "./FriendsPageLoading";
import { useAppDispatch } from "./../../../hooks/useAppDispatch";
import { useAppSelector } from "./../../../hooks/useAppSelector";
import { fetchFriendsTC } from "../../../redux/reducers/friendsReducer";
import { useQueryString } from "../../../hooks/useQueryString";

function FriendsPageAPI() {
	const dispatch = useAppDispatch();

	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const userNickname = useParams().nickname;
	const category = useParams().category;
	const location = useLocation().pathname;

	const search = useQueryString("search");

	const { totalCount, pageSize, whoseFriends } = useAppSelector(
		(state) => state.friends
	);
	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);

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
		if (
			userNickname &&
			(category === "all" ||
				category === "followers" ||
				category === "following")
		) {
			setIsLoading(true);
			dispatch(
				fetchFriendsTC({
					userNickname,
					category,
					page: currentPage,
					pageSize,
					search,
				})
			).finally(() => setIsLoading(false));
		}
	}, [userNickname, category, currentPage, pageSize, search, dispatch]);

	if (!userNickname) {
		if (!authNickname) {
			return <Navigate to="/login" />;
		}
		return <Navigate to={"/friends/" + authNickname + "/all"} />;
	}

	if (
		category !== "all"
			? category !== "followers"
				? category !== "following"
				: false
			: false
	) {
		return <Navigate to={"/friends/" + location.split("/")[2] + "/all"} />;
	}

	if (currentPage === 1 && isLoading) {
		return <FriendsPageLoading />;
	}

	if (!whoseFriends.nickname) {
		return (
			<section className="friends">
				<div className="subsection">
					<div className="friends__not_found">User not found</div>
				</div>
			</section>
		);
	}

	return (
		<>
			<FriendsPage isLoading={isLoading} category={category!} search={search} />
		</>
	);
}

export default FriendsPageAPI;
