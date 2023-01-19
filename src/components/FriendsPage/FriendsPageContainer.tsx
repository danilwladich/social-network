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
	authID: string;
	whoseFriends: WhoseFriends;
	usersData: FriendsUserData[];
	pageSize: number;
	totalCount: number;
	getFriendsTC: (
		userID: string,
		category: string,
		page: number,
		pageSize: number
	) => Promise<void>;
	setFollowTC: (userID: string) => Promise<void>;
	setUnfollowTC: (userID: string) => Promise<void>;
}

function FriendsPageAPI(props: IProps) {
	const whoseFriends = props.whoseFriends;
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	let userID = useParams().id;
	let category = useParams().category;
	let location = useLocation().pathname;

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
		if (
			userID &&
			(category === "all" ||
				category === "followers" ||
				category === "followed")
		) {
			setIsLoading(true);
			props
				.getFriendsTC(userID, category, currentPage, props.pageSize)
				.finally(() => setIsLoading(false));
		}
		// eslint-disable-next-line
	}, [userID, category, currentPage, props.pageSize]);

	if (!userID) {
		return <Navigate to={"/friends/" + props.authID + "/all"} />;
	}
	if (
		category !== "all"
			? category !== "followers"
				? category !== "followed"
				: false
			: false
	) {
		return <Navigate to={"/friends/" + location.split("/")[2] + "/all"} />;
	}

	if (currentPage === 1 && isLoading) {
		return (
			<>
				<FriendsPageLoading />
			</>
		);
	} else if (!whoseFriends.id) {
		return (
			<section className="friends">
				<div className="subsection">
					<div className="friends__not_found">User not found</div>
				</div>
			</section>
		);
	} else {
		document.title = `${whoseFriends.firstName} ${whoseFriends.lastName} ${
			category === "all"
				? "Friends"
				: category![0].toUpperCase() + category!.slice(1)
		}`;
		return (
			<>
				<FriendsPage
					isLoading={isLoading}
					category={category!}
					whoseFriends={whoseFriends}
					usersData={props.usersData}
					totalCount={props.totalCount}
					setFollowTC={props.setFollowTC}
					setUnfollowTC={props.setUnfollowTC}
				/>
			</>
		);
	}
}

function mapStateToProps(state: IState) {
	return {
		authID: state.auth.user.id,
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
