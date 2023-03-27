import React, { useState } from "react";
import { NewsPostData } from "../../../../models/News/NewsPostData";
import Linkify from "react-linkify";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import { setImages } from "../../../../redux/reducers/imagesReducer";

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
	const dispatch = useAppDispatch();

	const [showMore, setShowMore] = useState(false);

	const postData = props.postData;

	// if !showMore show first 75 words or 500 symbols
	const postToShow = showMore
		? postData.post
		: postData.post?.split(" ").slice(0, 75).join(" ").slice(0, 500);

	const images = postData.images;

	return (
		<>
			<div className="news__post_content">
				{!!postToShow && (
					<p className="news__post_content_text">
						<Linkify>{postToShow}</Linkify>

						{(postData.post!.split(" ").length > 75 ||
							postData.post!.length > 500) &&
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
					</p>
				)}

				{!!images?.length && (
					<div
						className={
							"news__post_content_images " + numberToWord(images.length)
						}
						style={
							images.length === 1
								? ({
										"--post-bg-blur": `url(${images[0]})`,
								  } as React.CSSProperties)
								: {}
						}
					>
						{images.map((image, index) => (
							<button
								key={index}
								onClick={() => dispatch(setImages({ images, current: index }))}
								className="news__post_content_image"
							>
								<img
									loading="lazy"
									src={image}
									alt={`${index} post ${postData.id}`}
								/>
							</button>
						))}
					</div>
				)}
			</div>
		</>
	);
}
