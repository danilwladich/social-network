import React from "react";

export function ProfilePageLoading() {
	return (
		<>
			<section className="profile">
				<div className="subsection">
					<div className="profile__loading">
						<div className="profile__loading_user">
							<div className="profile__loading_image loading_element"></div>
							<div className="profile__loading_name loading_element"></div>
						</div>

						<div className="profile__loading_actions">
							<div className="loading_element"></div>
							<div className="loading_element"></div>
						</div>
					</div>
				</div>

				<div className="subsection">
					<div className="profile__loading_about">
						<p className="loading_element"></p>
						<p className="loading_element"></p>
						<p className="loading_element"></p>
						<p className="loading_element"></p>
					</div>
				</div>

				<div className="subsection">
					<div className="profile__loading_posts">
						<div className="profile__loading_posts_input loading_element"></div>
						<div className="profile__loading_posts_send loading_element"></div>
						<div className="profile__loading_post loading_element"></div>
						<div className="profile__loading_post loading_element"></div>
						<div className="profile__loading_post loading_element"></div>
					</div>
				</div>
			</section>
		</>
	);
}
