import React from "react";

interface IProps {
	itsMe: boolean;
}

export function ProfilePageLoading(props: IProps) {
	const loadingElements: JSX.Element[] = [];
	for (let i = 0; i < 8; i++) {
		loadingElements.push(<AboutUserLoading key={i} />);
	}
	return (
		<>
			<section className="profile">
				<div className="subsection">
					<div className="profile__loading">
						<div className="profile__loading_cover loading_element"></div>
						<div className="profile__loading_user">
							<div className="profile__loading_image loading_element"></div>
							<div className="profile__loading_info">
								<div className="profile__loading_name loading_element"></div>
								<div className="profile__loading_location loading_element"></div>
							</div>
						</div>

						<div className="profile__loading_actions">
							<div className="loading_element"></div>
							{!props.itsMe && <div className="loading_element"></div>}
						</div>
					</div>
				</div>

				<div className="subsection">
					<div className="profile__loading_about">
						<div className="profile__loading_about_links">
							<p className="loading_element"></p>
							<p className="loading_element"></p>
							<p className="loading_element"></p>
						</div>

						<div className="profile__loading_about_users">
							{loadingElements}
						</div>
					</div>
				</div>

				{props.itsMe && (
					<div className="subsection">
						<div className="profile__loading_posts">
							<div className="profile__loading_posts_input loading_element"></div>
							<div className="profile__loading_posts_send loading_element"></div>
						</div>
					</div>
				)}

				<div className="subsection">
					<div className="profile__loading_post loading_element"></div>
					<div className="profile__loading_post loading_element"></div>
					<div className="profile__loading_post loading_element"></div>
				</div>
			</section>
		</>
	);
}

function AboutUserLoading() {
	return (
		<div className="profile__loading_about_user">
			<div className="profile__loading_about_user_image loading_element"></div>
			<div className="profile__loading_about_user_name loading_element"></div>
		</div>
	);
}
