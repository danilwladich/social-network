import React from "react";
import { NewsPostData } from "../../../../models/News/NewsPostData";
import { NavLink } from "react-router-dom";
import { Content } from "./Content";
import { Info } from "./Info";

interface IProps {
	postData: NewsPostData;
	buttonInProgress: boolean;
	bodyTheme: string;
	likePost: () => void;
	unlikePost: () => void;
}

export function Post(props: IProps) {
	const postData = props.postData;
	const ownerData = postData.owner;

	return (
		<>
			<div className="news__post">
				<div className="news__post_owner">
					<NavLink
						draggable="false"
						to={"/" + ownerData.nickname}
						className="news__post_owner_image"
					>
						<img
							loading="lazy"
							src={
								ownerData.image || `/images/user&theme=${props.bodyTheme}.jpg`
							}
							alt={ownerData.nickname}
						/>
					</NavLink>

					<div className="news__post_owner_name">
						<NavLink draggable="false" to={"/" + ownerData.nickname}>
							{ownerData.firstName + " " + ownerData.lastName}
						</NavLink>
					</div>
				</div>

				<Content postData={postData} />

				<Info {...props} />
			</div>
		</>
	);
}
