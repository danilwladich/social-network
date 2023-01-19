import React, { useState } from "react";
import { User } from "./Users/User";
import "./UsersPage.css";
import { UsersUserData } from "../../models/Users/UsersUserData";
import { UsersPagination } from "./Users/UsersPagination";

interface IProps {
	usersData: UsersUserData[];
	pageSize: number;
	totalCount: number;
	currentPage: number;
	pageChanged: (page: number) => void;
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
					<h2 className="users__title title">Find users</h2>
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

					<UsersPagination
						pageSize={props.pageSize}
						totalCount={props.totalCount}
						currentPage={props.currentPage}
						pageChanged={props.pageChanged}
					/>
				</div>
			</section>
		</>
	);
}
