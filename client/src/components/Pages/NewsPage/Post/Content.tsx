import React, { useRef, useState } from "react";
import { useUrlifyText } from "../../../../hooks/useUrlifyText";
import { NewsPostData } from "../../../../models/News/NewsPostData";

interface IProps {
	postData: NewsPostData;
}

function numberToWord(number: number) {
	const numbers = [
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine",
		"ten",
	];

	return numbers[number - 1];
}

export function Content(props: IProps) {
	const postTextRef = useRef<HTMLDivElement>(null);
	const [showMore, setShowMore] = useState(false);
	const postData = props.postData;

	// if !showMore show first 75 words or 500 symbols
	const postToShow = showMore
		? postData.post
		: postData.post.split(" ").slice(0, 75).join(" ").slice(0, 500);

	useUrlifyText(postToShow, postTextRef);

	const images: string[] = [];

	const imagesCount = numberToWord(images.length);

	return (
		<>
			<div className="news__post_content">
				{!!postToShow && (
					<div className="news__post_content_text">
						<span ref={postTextRef}>{postToShow}</span>

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
				)}

				{!!images.length && (
					<div className={"news__post_content_images " + imagesCount}>
						{images.map((i, index) => (
							<div key={index} className="news__post_content_image">
								<img src={i} alt="post" />
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
}
