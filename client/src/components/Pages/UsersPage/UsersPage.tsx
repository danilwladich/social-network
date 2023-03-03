import React, { useState } from "react";
import "./UsersPage.css";
import { User } from "./User/User";
import { LoadingCircle } from "../../assets/svg/LoadingCircle";
import { Search } from "./Search";
import { Helmet } from "react-helmet";
import { useAppDispatch } from "./../../../hooks/useAppDispatch";
import { useAppSelector } from "./../../../hooks/useAppSelector";
import {
	setFollowTC,
	setUnfollowTC,
} from "../../../redux/reducers/usersReducer";

interface IProps {
	isLoading: boolean;
	search?: string;
}

export function UsersPage(props: IProps) {
	const dispatch = useAppDispatch();

	const [followButtonsInProgress, setFollowButtonsInProgress] = useState<
		string[]
	>([]);

	const { usersData } = useAppSelector((state) => state.users);
	const { isAuth } = useAppSelector((state) => state.auth);

	async function setFollow(userNickname: string) {
		setFollowButtonsInProgress((prev) => [...prev, userNickname]);

		await dispatch(setFollowTC(userNickname));

		setFollowButtonsInProgress((prev) =>
			prev.filter((nickname) => nickname !== userNickname)
		);
	}
	async function setUnfollow(userNickname: string) {
		setFollowButtonsInProgress((prev) => [...prev, userNickname]);

		await dispatch(setUnfollowTC(userNickname));

		setFollowButtonsInProgress((prev) =>
			prev.filter((nickname) => nickname !== userNickname)
		);
	}

	return (
		<>
			<Helmet>
				<title>Find users</title>
			</Helmet>

			<section className="users">
				<div className="subsection">
					<Search search={props.search} />
				</div>

				<div className="subsection">
					{!!usersData.length ? (
						<div className="users__items">
							{usersData.map((u) => (
								<User
									key={u.nickname}
									isAuth={isAuth}
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
						<div className="users__items_no_items">
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
