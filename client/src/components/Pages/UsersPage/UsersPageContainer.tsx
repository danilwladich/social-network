import React, { useEffect, useLayoutEffect, useState } from "react";
import { UsersPage } from "./UsersPage";
import { UsersPageLoading } from "./UsersPageLoading";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "./../../../hooks/useAppDispatch";
import { fetchUsersTC } from "../../../redux/reducers/usersReducer";
import { useAppSelector } from "./../../../hooks/useAppSelector";

function UsersPageAPI() {
	const dispatch = useAppDispatch();

	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const { totalCount, pageSize } = useAppSelector((state) => state.users);

	const query = useLocation().search.slice(1).replaceAll("&", " ").split(" ");
	const search = query.find((q) => q.split("=")[0] === "search")?.split("=")[1];

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
		setIsLoading(true);
		dispatch(fetchUsersTC({ page: currentPage, pageSize, search })).finally(
			() => setIsLoading(false)
		);
	}, [currentPage, pageSize, search, dispatch]);

	if (isLoading && currentPage === 1) {
		return <UsersPageLoading />;
	}

	return (
		<>
			<UsersPage isLoading={isLoading} search={search} />
		</>
	);
}

export default UsersPageAPI;
