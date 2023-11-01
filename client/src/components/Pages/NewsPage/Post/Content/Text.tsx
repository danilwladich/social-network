import React, { useState } from "react";
import Linkify from "react-linkify";

interface IProps {
	post: string;
}

export function Text(props: IProps) {
	const [showMore, setShowMore] = useState(false);

	const post = props.post;

	// if !showMore show first 75 words or 500 symbols
	const postToShow = showMore
		? post
		: post.split(" ").slice(0, 75).join(" ").slice(0, 500);

	const isLongPost = post.split(" ").length > 75 || post.length > 500;

	return (
		<>
			<p className="news__post_content_text">
				<Linkify>{postToShow}</Linkify>

				{isLongPost && !showMore && (
					<button onClick={() => setShowMore(true)} className="news__post_more">
						Show more
					</button>
				)}
			</p>
		</>
	);
}
