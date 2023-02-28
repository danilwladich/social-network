import React, { useEffect, useLayoutEffect, useState } from "react";
import { NewsPage } from "./NewsPage";
import { NewsPageLoading } from "./NewsPageLoading";
import { useAppDispatch } from "./../../../hooks/useAppDispatch";
import { fetchNewsTC } from "../../../redux/reducers/newsReducer";
import { useAppSelector } from "./../../../hooks/useAppSelector";

function NewsPageAPI() {
	const dispatch = useAppDispatch();

	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const { totalCount, pageSize } = useAppSelector((state) => state.news);

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
		dispatch(fetchNewsTC({ page: currentPage, pageSize })).finally(() => {
			setIsLoading(false);
		});
	}, [currentPage, pageSize, dispatch]);

	if (isLoading && currentPage === 1) {
		return <NewsPageLoading />;
	}

	return (
		<>
			<NewsPage isLoading={isLoading} />
		</>
	);
}

export default NewsPageAPI;
