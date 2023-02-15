import React from "react";
import { NavLink } from "react-router-dom";
import { ProfileAboutData } from "../../../../models/Profile/ProfileAboutData";

interface IProps {
	aboutData: ProfileAboutData;
	userNickname: string;
}

export function About(props: IProps) {
	const aboutData = props.aboutData;
	return (
		<>
			<div className="profile__about">
				{Object.entries(aboutData.follow).map((kv) => (
					<NavLink
						key={kv[0]}
						to={
							"/friends/" +
							props.userNickname +
							"/" +
							(kv[0] === "friends" ? "all" : kv[0])
						}
						className="profile__about_link"
					>
						<strong>{kv[0]}</strong> {kv[1]}
					</NavLink>
				))}
			</div>
		</>
	);
}
