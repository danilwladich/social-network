import React from "react";
import { NewsPostData } from "../../../../models/News/NewsPostData";
import { LikeHeart } from "../../../assets/LikeHeart";
import { LoadingCircle } from "../../../assets/LoadingCircle";

interface IProps {
	postData: NewsPostData;
	buttonInProgress: boolean;
	likePost: () => void;
	unlikePost: () => void;
}

export function Info(props: IProps) {
	const postData = props.postData;

	const date = postData.date.split(" ");
	const dateNow = new Date().toString().split(" ").slice(1, 5);
	const dateToShow =
		date[0] === dateNow[0] && date[2] === dateNow[2]
			? date[1] === dateNow[1]
				? date[3].slice(0, 5)
				: date[0] + " " + date[1] + " " + date[3].slice(0, 5)
			: date[1] + " " + date[0] + " " + date[2];

	const likes = postData.likes.toString();
	const likesToShow =
		postData.likes >= 1000
			? likes.slice(0, -3) + "." + likes.slice(-3, -2) + "K"
			: likes;

	return (
		<>
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
		</>
	);
}
