import React from "react";

interface IProps {
	likes: number;
}

export function LikesToShow(props: IProps) {
	const likes = props.likes.toString();

	let likesToShow;
	if (+likes >= 1000) {
		likesToShow = likes.slice(0, -3) + "." + likes.slice(-3, -2) + "K";
	} else {
		likesToShow = props.likes;
	}

	return <span className="likesToShow">{likesToShow}</span>;
}
