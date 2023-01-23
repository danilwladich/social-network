import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FriendsUserData } from "../../models/Friends/FriendsUserData";
import { WhoseFriends } from "../../models/Friends/WhoseFriends";
import { LoadingCircle } from "../assets/LoadingCircle";
import { Categories } from "./Categories/Categories";
import "./FriendsPage.css";
import { User } from "./Users/User";

interface IProps {
	isLoading: boolean;
	category: string;
	authID: string;
	whoseFriends: WhoseFriends;
	usersData: FriendsUserData[];
	totalCount: number;
	setFollowTC: (userID: string) => Promise<void>;
	setUnfollowTC: (userID: string) => Promise<void>;
}

export function FriendsPage(props: IProps) {
	const whoseFriends = props.whoseFriends;
	const usersData = props.usersData;
	const [followButtonsInProgress, setFollowButtonsInProgress] = useState<
		string[]
	>([]);

	function setFollow(userID: string) {
		setFollowButtonsInProgress((prev) => [...prev, userID]);
		props
			.setFollowTC(userID)
			.finally(() =>
				setFollowButtonsInProgress((prev) => prev.filter((id) => id !== userID))
			);
	}
	function setUnfollow(userID: string) {
		setFollowButtonsInProgress((prev) => [...prev, userID]);
		props
			.setUnfollowTC(userID)
			.finally(() =>
				setFollowButtonsInProgress((prev) => prev.filter((id) => id !== userID))
			);
	}
	return (
		<>
			<section className="friends">
				<div className="subsection">
					<div className="friends__title title">
						<NavLink draggable="false" to={"/" + whoseFriends.id}>
							<img
								src={whoseFriends.image || "/images/user.jpg"}
								alt={whoseFriends.id}
							/>
						</NavLink>
						<NavLink draggable="false" to={"/" + whoseFriends.id}>
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

					<Categories id={whoseFriends.id} />

					<div className="friends__total">
						<strong>Total count:</strong>{" "}
						{usersData.length || "There is nothing here yet"}
					</div>

					<div className="friends__items">
						{props.usersData.map((u) => (
							<User
								key={u.id}
								itsMe={u.id === props.authID}
								userData={u}
								setFollow={() => setFollow(u.id)}
								setUnfollow={() => setUnfollow(u.id)}
								followButtonInProgress={followButtonsInProgress.some(
									(id) => id === u.id
								)}
							/>
						))}
					</div>

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
