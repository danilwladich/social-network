import React from "react";
import "./ProfilePage.css";
import { UserContainer } from "./User/UserContainer";
import { PostsContainer } from "./Posts/PostsContainer";
import { AboutContainer } from "./About/AboutContainer";
import { ActionsContainer } from "./Actions/ActionsContainer";

export function ProfilePage() {
	return (
		<>
			<section className="profile">
				<div className="subsection">
					<UserContainer />

					<ActionsContainer />
				</div>

				<div className="subsection nf">
					<AboutContainer />
				</div>

				<div className="subsection">
					<PostsContainer />
				</div>
			</section>
		</>
	);
}
