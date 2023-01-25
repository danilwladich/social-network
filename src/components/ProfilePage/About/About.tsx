import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ProfileAboutData } from "../../../models/Profile/ProfileAboutData";

interface IProps {
	aboutData: ProfileAboutData;
	userID: string;
}

export function About(props: IProps) {
	const aboutData = props.aboutData;
	const [showMore, setShowMore] = useState(false);
	
	return (
		<>
			<div className="profile__about">
				<p>
					<NavLink to={"/friends/" + props.userID + "/all"}>
						<strong>Friends:</strong> {aboutData.friends}
					</NavLink>
				</p>

				{Object.entries(aboutData.follow).map((kv) => (
					<p key={kv[0]}>
						<NavLink to={"/friends/" + props.userID + "/" + kv[0]}>
							<strong>{kv[0]}:</strong> {kv[1]}
						</NavLink>
					</p>
				))}

				{showMore &&
					Object.entries(aboutData.location).map((kv) =>
						kv[1] ? (
							<p key={kv[0]}>
								<strong>{kv[0]}:</strong> {kv[1]}
							</p>
						) : (
							true
						)
					)}
			</div>

			{Object.values(aboutData.location).some((e) => e) && (
				<button
					onClick={() => setShowMore((prev) => !prev)}
					className="profile__about_more"
				>
					{showMore ? "Less info" : "More info"}
				</button>
			)}
		</>
	);
}
