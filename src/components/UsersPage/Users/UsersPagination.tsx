import React from "react";
import { Arrow } from "../../assets/Arrow";

interface IProps {
	pageSize: number;
	totalCount: number;
	currentPage: number;
	pageChanged: (page: number) => void;
}

export function UsersPagination(props: IProps) {
	const pagesCount = Math.ceil(props.totalCount / props.pageSize);
	const pages: number[] = [];
	for (
		let i = pagesCount >= 7 ? props.currentPage - 3 : 1;
		i <= (pagesCount >= 7 ? props.currentPage + 3 : pagesCount);
		i++
	) {
		if (i <= 0 || i > pagesCount) {
			continue;
		}
		pages.push(i);
	}
	if (pagesCount >= 7) {
		while (pages.length < 7) {
			if (props.currentPage <= 3) {
				pages.push(pages[pages.length - 1] + 1);
			}
			if (props.currentPage > 3) {
				pages.unshift(pages[0] - 1);
			}
		}
	}

	return (
		<>
			<div className="users__pagination">
				<button
					onClick={() => props.pageChanged(props.currentPage - 1)}
					disabled={props.currentPage === 1}
					className="users__pagination_arrow"
				>
					<Arrow />
				</button>
				{pages.map((p) => (
					<button
						key={p}
						onClick={() => props.pageChanged(p)}
						disabled={p === props.currentPage}
						className={
							"users__pagination_page " +
							(p === props.currentPage ? "active" : "")
						}
					>
						{(p === pages[0] && p !== 1 ? "..." : "") +
							p +
							(p === pages[pages.length - 1] && p !== pagesCount ? "..." : "")}
					</button>
				))}
				<button
					onClick={() => props.pageChanged(props.currentPage + 1)}
					disabled={props.currentPage === pagesCount}
					className="users__pagination_arrow"
				>
					<Arrow />
				</button>
			</div>
		</>
	);
}
