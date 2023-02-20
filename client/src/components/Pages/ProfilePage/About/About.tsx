import React from "react";
import { NavLink } from "react-router-dom";
import { ProfileFollowData } from "../../../../models/Profile/ProfileFollowData";
import { User } from "./User/User";

interface IProps {
	followData: ProfileFollowData;
	userNickname: string;
	bodyTheme: string;
}

export function About(props: IProps) {
	const followData = props.followData;
	const friends = followData.friends;
	const followers = followData.followers;
	const following = followData.following;
	return (
		<>
			<div className="profile__about">
				<div className="profile__about_links">
					<NavLink
						draggable="false"
						to={"/friends/" + props.userNickname + "/all"}
						className="profile__about_link"
					>
						Friends <span>{friends.totalCount}</span>
					</NavLink>

					<NavLink
						draggable="false"
						to={"/friends/" + props.userNickname + "/followers"}
						className="profile__about_link"
					>
						Followers <span>{followers}</span>
					</NavLink>

					<NavLink
						draggable="false"
						to={"/friends/" + props.userNickname + "/following"}
						className="profile__about_link"
					>
						Following <span>{following}</span>
					</NavLink>
				</div>

				{!!friends.usersData.length && (
					<div className="profile__about_users">
						{friends.usersData.slice(0, 8).map((u) => (
							<User key={u.nickname} user={u} bodyTheme={props.bodyTheme} />
						))}
					</div>
				)}
			</div>
		</>
	);
}
