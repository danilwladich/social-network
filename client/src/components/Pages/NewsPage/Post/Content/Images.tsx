import React from "react";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { setImages } from "../../../../../redux/reducers/imagesReducer";

interface IProps {
	images: string[];
	postId: string;
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

export function Images(props: IProps) {
	const dispatch = useAppDispatch();

	const images = props.images;

	return (
		<>
			<div
				className={"news__post_content_images " + numberToWord(images.length)}
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
							alt={`${index} post ${props.postId}`}
						/>
					</button>
				))}
			</div>
		</>
	);
}
