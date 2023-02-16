import React, { useState } from "react";
import { User } from "./User/User";
import "./UsersPage.css";
import { UsersUserData } from "../../../models/Users/UsersUserData";
import { LoadingCircle } from "../../assets/LoadingCircle";
import { UsersSearch } from "./Search/UsersSearch";

interface IProps {
	isAuth: boolean;
	usersData: UsersUserData[];
	isLoading: boolean;
	search?: string;
	setFollowTC: (userNickname: string) => Promise<void>;
	setUnfollowTC: (userNickname: string) => Promise<void>;
}

export function UsersPage(props: IProps) {
	const [followButtonsInProgress, setFollowButtonsInProgress] = useState<
		string[]
	>([]);

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
			<section className="users">
				<div className="subsection">
					<UsersSearch search={props.search} />
				</div>

				<div className="subsection">
					{!!props.usersData.length ? (
						<div className="users__items">
							{props.usersData.map((u) => (
								<User
									key={u.nickname}
									isAuth={props.isAuth}
									userData={u}
									setFollow={() => setFollow(u.nickname)}
									setUnfollow={() => setUnfollow(u.nickname)}
									followButtonInProgress={followButtonsInProgress.some(
										(nickname) => nickname === u.nickname
									)}
								/>
							))}
						</div>
					) : (
						<div className="users__no_items">
							Your search returned no results
						</div>
					)}

					{props.isLoading && (
						<div className="users__items_loading">
							<LoadingCircle />
						</div>
					)}
				</div>
			</section>
		</>
	);
}
