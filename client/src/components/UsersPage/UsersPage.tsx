import React, { useState } from "react";
import { User } from "./Users/User";
import "./UsersPage.css";
import { UsersUserData } from "../../models/Users/UsersUserData";
import { LoadingCircle } from "../assets/LoadingCircle";
import { UsersSearch } from "./Search/UsersSearch";

interface IProps {
	usersData: UsersUserData[];
	isLoading: boolean;
	search?: string;
	setFollowTC: (userID: string) => Promise<void>;
	setUnfollowTC: (userID: string) => Promise<void>;
}

export function UsersPage(props: IProps) {
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
			<section className="users">
				<div className="subsection">
					<UsersSearch search={props.search} />

					{!!props.usersData.length ? (
						<div className="users__items">
							{props.usersData.map((u) => (
								<User
									key={u.id}
									userData={u}
									setFollow={() => setFollow(u.id)}
									setUnfollow={() => setUnfollow(u.id)}
									followButtonInProgress={followButtonsInProgress.some(
										(id) => id === u.id
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
