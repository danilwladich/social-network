import React, { useState } from "react";
import { ProfilePostData } from "../../../models/Profile/ProfilePostData";
import { LikeHeart } from "../../assets/LikeHeart";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	postData: ProfilePostData;
	buttonInProgress: boolean;
	deletePost?: () => void;
	likePost: () => void;
	unlikePost: () => void;
}

export function Post(props: IProps) {
	const [showActions, setShowActions] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const postData = props.postData;

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
			<div className="profile__post">
				<div className="profile__post_content">
					{postToShow}
					{(postData.post.split(" ").length > 75 ||
						postData.post.length > 500) &&
						!showMore && (
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
						disabled={props.buttonInProgress}
						className="profile__post_like"
					>
						{props.buttonInProgress ? (
							<LoadingCircle />
						) : (
							<LikeHeart likedMe={postData.likedMe} />
						)}
						{likesToShow}
					</button>

					{props.deletePost && (
						<div
							onMouseEnter={() => setShowActions(true)}
							onMouseLeave={() => setShowActions(false)}
							className="propfile__post_actions"
						>
							<button
								onClick={() => {
									showActions ? setShowActions(false) : setShowActions(true);
								}}
								className="profile__post_showactions"
							>
								<span></span>
							</button>

							<button
								disabled={props.buttonInProgress}
								onClick={() => props.deletePost!()}
								className={
									"profile__post_delete " + (showActions ? "active" : "")
								}
							>
								{props.buttonInProgress ? <LoadingCircle /> : "Delete post"}
							</button>
						</div>
					)}

					<div className="profile__post_date">{dateToShow}</div>
				</div>
			</div>
		</>
	);
}
