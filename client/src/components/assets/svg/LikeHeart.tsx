import React from "react";

interface IProps {
	likedMe: boolean;
}

export function LikeHeart(props: IProps) {
	return (
		<>
			<svg
				className={"likeHeart " + (props.likedMe ? "likedMe" : "")}
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M19.5355 5.46448C21.4881 7.4171 21.4881 10.5829 19.5355 12.5355L12.7071 19.364C12.3166 19.7545 11.6834 19.7545 11.2929 19.364L4.46447 12.5355C2.51184 10.5829 2.51184 7.4171 4.46447 5.46448C6.0168 3.91215 7.89056 3.43683 9.78125 4.35939C10.5317 4.72556 11.5156 5.46448 12 6.4297C12.4844 5.46448 13.4683 4.72556 14.2187 4.35939C16.1094 3.43683 17.9832 3.91215 19.5355 5.46448Z"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				></path>{" "}
			</svg>
		</>
	);
}
