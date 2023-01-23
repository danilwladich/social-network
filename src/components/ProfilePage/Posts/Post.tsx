import React, { useState } from "react";
import { ProfilePostData } from "../../../models/Profile/ProfilePostData";
import { LikeHeart } from "../../assets/LikeHeart";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	postData: ProfilePostData;
	likeButtonInProgress: boolean;
	likePost: () => void;
	unlikePost: () => void;
}

export function Post(props: IProps) {
	const [showMore, setShowMore] = useState(false);
	const postData = props.postData;

	const postToShow = showMore
		? postData.post
		: postData.post.split(" ").slice(0, 75).join(" ");

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
			<div className="profile__post">
				<div className="profile__post_content">
					{postToShow}
					{postData.post.split(" ").length > 75 && !showMore && (
						<>
							<span> ... </span>
							<button
								onClick={() => setShowMore(true)}
								className="profile__post_more"
							>
								Show more
							</button>
						</>
					)}
				</div>
				<div className="profile__post_info">
					<button
						onClick={() =>
							postData.likedMe ? props.unlikePost() : props.likePost()
						}
						disabled={props.likeButtonInProgress}
						className="profile__post_like"
					>
						{props.likeButtonInProgress ? (
							<LoadingCircle />
						) : (
							<LikeHeart likedMe={postData.likedMe} />
						)}
						{likesToShow}
					</button>

					<div className="profile__post_date">{dateToShow}</div>
				</div>
			</div>
		</>
	);
}
