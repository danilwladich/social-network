import React, { useState } from "react";
import { ProfilePostData } from "../../../../models/Profile/ProfilePostData";

interface IProps {
	postData: ProfilePostData;
}

export function Content(props: IProps) {
	const [showMore, setShowMore] = useState(false);
	const postData = props.postData;

	const postToShow = showMore
		? postData.post
		: postData.post.split(" ").slice(0, 75).join(" ").slice(0, 500);
	return (
		<>
			<div className="profile__post_content">
				{postToShow}
				{(postData.post.split(" ").length > 75 || postData.post.length > 500) &&
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
		</>
	);
}
