import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FriendsUserData } from "../../../models/Friends/FriendsUserData";
import { WhoseFriends } from "../../../models/Friends/WhoseFriends";
import { LoadingCircle } from "../../Assets/LoadingCircle";
import { Categories } from "./Categories/Categories";
import "./FriendsPage.css";
import { FriendsSearch } from "./Search/FriendsSearch";
import { User } from "./User/User";

interface IProps {
	isLoading: boolean;
	category: string;
	authNickname: string;
	whoseFriends: WhoseFriends;
	usersData: FriendsUserData[];
	totalCount: number;
	search?: string;
	setFollowTC: (userNickname: string) => Promise<void>;
	setUnfollowTC: (userNickname: string) => Promise<void>;
}

export function FriendsPage(props: IProps) {
	const [followButtonsInProgress, setFollowButtonsInProgress] = useState<
		string[]
	>([]);

	const whoseFriends = props.whoseFriends;
	const usersData = props.usersData;

	function setFollow(userNickname: string) {
		setFollowButtonsInProgress((prev) => [...prev, userNickname]);
		props
			.setFollowTC(userNickname)
			.finally(() =>
				setFollowButtonsInProgress((prev) =>
					prev.filter((nickname) => nickname !== userNickname)
				)
			);
	}
	function setUnfollow(userNickname: string) {
		setFollowButtonsInProgress((prev) => [...prev, userNickname]);
		props
			.setUnfollowTC(userNickname)
			.finally(() =>
				setFollowButtonsInProgress((prev) =>
					prev.filter((nickname) => nickname !== userNickname)
				)
			);
	}

	return (
		<>
			<section className="friends">
				<div className="subsection">
					<div className="friends__title title">
						<NavLink draggable="false" to={"/" + whoseFriends.nickname}>
							<img
								src={whoseFriends.image || "/images/user.jpg"}
								alt={whoseFriends.nickname}
							/>
						</NavLink>

						<NavLink draggable="false" to={"/" + whoseFriends.nickname}>
							<h2>
								{`${whoseFriends.firstName} ${whoseFriends.lastName} ${
									props.category === "all"
										? "Friends"
										: props.category![0].toUpperCase() +
										  props.category!.slice(1)
								}`}
							</h2>
						</NavLink>
					</div>

					<Categories nickname={whoseFriends.nickname} />

					{(props.usersData.length > 10 || !!props.search) && (
						<FriendsSearch
							nickname={whoseFriends.nickname}
							category={props.category}
							search={props.search}
						/>
					)}

					<div className="friends__total">
						{!props.search || !!props.usersData.length ? (
							<>
								<strong>Total count</strong>{" "}
								{usersData.length ||
									`${
										whoseFriends.nickname === props.authNickname
											? "You"
											: whoseFriends.firstName
									} don't have any ${
										props.category === "all" ? "friends" : props.category
									} yet`}
							</>
						) : (
							!props.usersData.length && <>Your search returned no results</>
						)}
					</div>

					{!!props.usersData.length && (
						<div className="friends__items">
							{props.usersData.map((u) => (
								<User
									key={u.nickname}
									itsMe={u.nickname === props.authNickname}
									userData={u}
									setFollow={() => setFollow(u.nickname)}
									setUnfollow={() => setUnfollow(u.nickname)}
									followButtonInProgress={followButtonsInProgress.some(
										(nickname) => nickname === u.nickname
									)}
								/>
							))}
						</div>
					)}

					{props.isLoading && (
						<div className="friends__items_loading">
							<LoadingCircle />
						</div>
					)}
				</div>
			</section>
		</>
	);
}
