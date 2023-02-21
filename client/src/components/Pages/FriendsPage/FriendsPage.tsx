import React, { useState } from "react";
import { FriendsUserData } from "../../../models/Friends/FriendsUserData";
import { WhoseFriends } from "../../../models/Friends/WhoseFriends";
import { LoadingCircle } from "../../assets/LoadingCircle";
import { Categories } from "./Categories";
import "./FriendsPage.css";
import { Search } from "./Search";
import { Title } from "./Title";
import { User } from "./User/User";

interface IProps {
	isLoading: boolean;
	category: string;
	authNickname: string;
	whoseFriends: WhoseFriends;
	usersData: FriendsUserData[];
	totalCount: number;
	search?: string;
	bodyTheme: string;
	setFollowTC: (userNickname: string) => Promise<void>;
	setUnfollowTC: (userNickname: string) => Promise<void>;
}

export function FriendsPage(props: IProps) {
	const [followButtonsInProgress, setFollowButtonsInProgress] = useState<
		string[]
	>([]);

	const whoseFriends = props.whoseFriends;
	const usersData = props.usersData;

	const category = props.category === "all" ? "friends" : props.category;

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
					<Title
						whoseFriends={whoseFriends}
						bodyTheme={props.bodyTheme}
						category={category}
					/>

					<Categories nickname={whoseFriends.nickname} />

					{(usersData.length > 10 || !!props.search) && (
						<Search
							nickname={whoseFriends.nickname}
							category={props.category}
							search={props.search}
						/>
					)}

					{!!usersData.length ? (
						<div className="friends__items">
							{usersData.map((u) => (
								<User
									key={u.nickname}
									isAuth={!!props.authNickname}
									itsMe={u.nickname === props.authNickname}
									userData={u}
									bodyTheme={props.bodyTheme}
									setFollow={() => setFollow(u.nickname)}
									setUnfollow={() => setUnfollow(u.nickname)}
									followButtonInProgress={followButtonsInProgress.some(
										(nickname) => nickname === u.nickname
									)}
								/>
							))}
						</div>
					) : (
						<div className="friends__items_no_items">
							{!props.search
								? `${
										whoseFriends.nickname === props.authNickname
											? "You"
											: whoseFriends.firstName
								  }	don't have any ${category} yet`
								: "Your search returned no results"}
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
