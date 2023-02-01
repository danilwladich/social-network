import React from "react";

export function NewsPageLoading() {
	return (
		<section className="news">
			<div className="subsection">
				<h2 className="news__title title">News</h2>
				<div className="news__loading_posts">
					<div className="news__loading_post loading_element"></div>
					<div className="news__loading_post loading_element"></div>
					<div className="news__loading_post loading_element"></div>
					<div className="news__loading_post loading_element"></div>
					<div className="news__loading_post loading_element"></div>
					<div className="news__loading_post loading_element"></div>
					<div className="news__loading_post loading_element"></div>
					<div className="news__loading_post loading_element"></div>
				</div>
			</div>
		</section>
	);
}
