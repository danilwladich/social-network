import React, { useState } from "react";
import { NewsPostData } from "../../../models/News/NewsPostData";
import { LikeHeart } from "../../assets/LikeHeart";
import { LoadingCircle } from "../../assets/LoadingCircle";
import { NavLink } from "react-router-dom";

interface IProps {
	postData: NewsPostData;
	buttonInProgress: boolean;
	likePost: () => void;
	unlikePost: () => void;
}

export function Post(props: IProps) {
	const [showMore, setShowMore] = useState(false);
	const postData = props.postData;
	const ownerData = postData.owner;

	const postToShow = showMore
		? postData.post
		: postData.post.split(" ").slice(0, 75).join(" ").slice(0, 500);

	const date = postData.date.split(" ");
	const dateNow = new Date().toString().split(" ").slice(1, 5);
	const dateToShow =
		date[0] === dateNow[0] && date[2] === dateNow[2]
			? date[1] === dateNow[1]
				? date[3].slice(0, 5)
				: date[0] + " " + date[1] + " at " + date[3].slice(0, 5)
			: date[1] + " " + date[0] + " " + date[2];

	const likes = postData.likes.toString();
	const likesToShow =
		postData.likes >= 1000
			? likes.slice(0, -3) + "." + likes.slice(-3, -2) + "K"
			: likes;

	return (
		<>
			<div className="news__post">
				<div className="news__post_owner">
					<NavLink
						draggable="false"
						to={"/" + ownerData.id}
						className="news__post_owner_image"
					>
						<img
							loading="lazy"
							src={ownerData.image || "/images/user.jpg"}
							alt={ownerData.id}
						/>
					</NavLink>

					<div className="news__post_owner_name">
						<NavLink draggable="false" to={"/" + ownerData.id}>
							{ownerData.firstName + " " + ownerData.lastName}
						</NavLink>
					</div>
				</div>

				<div className="news__post_content">
					{postToShow}
					{(postData.post.split(" ").length > 75 ||
						postData.post.length > 500) &&
						!showMore && (
							<>
								<span> ... </span>
								<button
									onClick={() => setShowMore(true)}
									className="news__post_more"
								>
									Show more
								</button>
							</>
						)}
				</div>

				<div className="news__post_info">
					<button
						onClick={() =>
							postData.likedMe ? props.unlikePost() : props.likePost()
						}
						disabled={props.buttonInProgress}
						className="news__post_like"
					>
						{props.buttonInProgress ? (
							<LoadingCircle />
						) : (
							<LikeHeart likedMe={postData.likedMe} />
						)}
						{likesToShow}
					</button>

					<div className="news__post_date">{dateToShow}</div>
				</div>
			</div>
		</>
	);
}
