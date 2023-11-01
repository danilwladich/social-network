import React from "react";
import { NewsPostData } from "../../../../models/News/NewsPostData";
import { LikeHeart } from "../../../assets/svg/LikeHeart";
import { LikesToShow } from "../../../assets/LikesToShow";

interface IProps {
	postData: NewsPostData;
	buttonInProgress: boolean;
	likePost: () => void;
	unlikePost: () => void;
}

export function Footer(props: IProps) {
	const postData = props.postData;

	function onLikeClickHandler() {
		if (postData.likedMe) {
			props.unlikePost();
		} else {
			props.likePost();
		}
	}

	return (
		<>
			<div className="news__post_footer_info">
				<button
					onClick={() => onLikeClickHandler()}
					disabled={props.buttonInProgress}
					className="news__post_footer_like"
				>
					<LikeHeart likedMe={postData.likedMe} />

					<LikesToShow likes={postData.likes} />
				</button>
			</div>
		</>
	);
}
