import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "./User/User";
import { useAppSelector } from "./../../../../hooks/useAppSelector";

export function About() {
	const { followData } = useAppSelector((state) => state.profile);
	const { nickname: userNickname } = useAppSelector(
		(state) => state.profile.userData
	);

	const friends = followData.friends;
	const followers = followData.followers;
	const following = followData.following;
	return (
		<>
			<div className="profile__about">
				<div className="profile__about_links">
					<NavLink
						draggable="false"
						to={"/friends/" + userNickname + "/all"}
						className="profile__about_link"
					>
						Friends <span>{friends.totalCount}</span>
					</NavLink>

					<NavLink
						draggable="false"
						to={"/friends/" + userNickname + "/followers"}
						className="profile__about_link"
					>
						Followers <span>{followers}</span>
					</NavLink>

					<NavLink
						draggable="false"
						to={"/friends/" + userNickname + "/following"}
						className="profile__about_link"
					>
						Following <span>{following}</span>
					</NavLink>
				</div>

				{!!friends.usersData.length && (
					<div className="profile__about_users">
						{friends.usersData.slice(0, 8).map((u) => (
							<User key={u.nickname} userData={u} />
						))}
					</div>
				)}
			</div>
		</>
	);
}
