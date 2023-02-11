import React, { useEffect, useLayoutEffect, useState } from "react";
import { connect } from "react-redux";
import { IState } from "../../models/IState";
import { AuthRedirect } from "../../hoc/AuthRedirect";
import { compose } from "redux";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { FriendsPage } from "./FriendsPage";
import { getFriendsTC } from "../../redux/friendsReducer";
import { FriendsUserData } from "../../models/Friends/FriendsUserData";
import { WhoseFriends } from "../../models/Friends/WhoseFriends";
import { setFollowTC, setUnfollowTC } from "../../redux/usersReducer";
import { FriendsPageLoading } from "./FriendsPageLoading";

interface IProps {
	authNickname: string;
	whoseFriends: WhoseFriends;
	usersData: FriendsUserData[];
	pageSize: number;
	totalCount: number;
	getFriendsTC: (
		userNickname: string,
		category: string,
		page: number,
		pageSize: number,
		search?: string
	) => Promise<void>;
	setFollowTC: (userNickname: string) => Promise<void>;
	setUnfollowTC: (userNickname: string) => Promise<void>;
}

function FriendsPageAPI(props: IProps) {
	const whoseFriends = props.whoseFriends;
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const userNickname = useParams().nickname;
	const category = useParams().category;
	const location = useLocation().pathname;

	const query = useLocation().search.slice(1).replaceAll("&", " ").split(" ");
	const search = query.find((q) => q.split("=")[0] === "search")?.split("=")[1];

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
		if (
			userNickname &&
			(category === "all" ||
				category === "followers" ||
				category === "following")
		) {
			setIsLoading(true);
			props
				.getFriendsTC(
					userNickname,
					category,
					currentPage,
					props.pageSize,
					search
				)
				.finally(() => setIsLoading(false));
		}
		// eslint-disable-next-line
	}, [userNickname, category, currentPage, props.pageSize, search]);

	if (!userNickname) {
		return <Navigate to={"/friends/" + props.authNickname + "/all"} />;
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
	document.title = `${whoseFriends.firstName} ${whoseFriends.lastName} ${
		category === "all"
			? "Friends"
			: category![0].toUpperCase() + category!.slice(1)
	}`;
	return (
		<>
			<FriendsPage
				{...props}
				isLoading={isLoading}
				category={category!}
				search={search}
			/>
		</>
	);
}

function mapStateToProps(state: IState) {
	return {
		authNickname: state.auth.user.nickname,
		whoseFriends: state.friends.whoseFriends,
		usersData: state.friends.usersData,
		pageSize: state.friends.pageSize,
		totalCount: state.friends.totalCount,
	};
}

const FriendsPageContainer: any = compose(
	connect(mapStateToProps, {
		getFriendsTC,
		setFollowTC,
		setUnfollowTC,
	}),
	AuthRedirect
)(FriendsPageAPI);

export default FriendsPageContainer;
