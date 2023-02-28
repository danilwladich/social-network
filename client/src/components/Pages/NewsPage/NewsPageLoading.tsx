import React from "react";

export function NewsPageLoading() {
	const loadingElements: JSX.Element[] = [];
	for (let i = 0; i < 10; i++) {
		loadingElements.push(<PostLoading key={i} />);
	}
	return (
		<section className="news">
			<div className="subsection">
				<div className="news__loading_posts">{loadingElements}</div>
			</div>
		</section>
	);
}

function PostLoading() {
	return (
		<div className="news__loading_post">
			<div className="news__loading_post_owner">
				<div className="news__loading_post_owner_image loading_element"></div>
				<div className="news__loading_post_owner_name loading_element"></div>
			</div>
			<div className="news__loading_post_content loading_element"></div>
		</div>
	);
}
