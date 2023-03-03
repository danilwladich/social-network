import React, { useEffect, useLayoutEffect, useState } from "react";
import { UsersPage } from "./UsersPage";
import { UsersPageLoading } from "./UsersPageLoading";
import { useAppDispatch } from "./../../../hooks/useAppDispatch";
import { fetchUsersTC } from "../../../redux/reducers/usersReducer";
import { useAppSelector } from "./../../../hooks/useAppSelector";
import { useQueryString } from "../../../hooks/useQueryString";

function UsersPageAPI() {
	const dispatch = useAppDispatch();

	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const { totalCount, pageSize } = useAppSelector((state) => state.users);

	const search = useQueryString("search");

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
