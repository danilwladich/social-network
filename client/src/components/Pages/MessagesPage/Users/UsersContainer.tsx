import React, { useEffect, useLayoutEffect, useState } from "react";
import { Users } from "./Users";
import { UsersLoading } from "./UsersLoading";
import { useAppSelector } from "./../../../../hooks/useAppSelector";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import { fetchChatsTC } from "../../../../redux/reducers/messagesReducer";

export function UsersContainerAPI() {
	const dispatch = useAppDispatch();

	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const { usersTotalCount: totalCount, usersPageSize: pageSize } =
		useAppSelector((state) => state.messages);

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
		dispatch(fetchChatsTC({ page: currentPage, pageSize })).finally(() =>
			setIsLoading(false)
		);
	}, [currentPage, pageSize, dispatch]);

	if (isLoading) {
		return <UsersLoading />;
	}

	return (
		<>
			<Users />
		</>
	);
}

export default UsersContainerAPI;
