import React, { useState } from "react";
import "./FriendsPage.css";
import { LoadingCircle } from "../../assets/LoadingCircle";
import { Categories } from "./Categories";
import { Search } from "./Search";
import { Title } from "./Title";
import { Helmet } from "react-helmet";
import { User } from "./User/User";
import { useAppDispatch } from "./../../../hooks/useAppDispatch";
import { useAppSelector } from "./../../../hooks/useAppSelector";
import {
	setFollowTC,
	setUnfollowTC,
} from "../../../redux/reducers/friendsReducer";

interface IProps {
	isLoading: boolean;
	category: string;
	search?: string;
}

export function FriendsPage(props: IProps) {
	const dispatch = useAppDispatch();

	const [followButtonsInProgress, setFollowButtonsInProgress] = useState<
		string[]
	>([]);

	const { whoseFriends, usersData } = useAppSelector((state) => state.friends);
	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);
	const { bodyTheme } = useAppSelector((state) => state.settings);

	const category = props.category === "all" ? "friends" : props.category;

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
				<title>{`${whoseFriends.firstName} ${whoseFriends.lastName} ${
					category === "all"
						? "Friends"
						: category![0].toUpperCase() + category!.slice(1)
				}`}</title>
			</Helmet>

			<section className="friends">
				<div className="subsection">
					<Title
						whoseFriends={whoseFriends}
						bodyTheme={bodyTheme}
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
									isAuth={!!authNickname}
									itsMe={u.nickname === authNickname}
									userData={u}
									bodyTheme={bodyTheme}
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
										whoseFriends.nickname === authNickname
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
