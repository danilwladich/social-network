import React from "react";
import "./ProfilePage.css";
import PostsContainer from "./Posts/PostsContainer";
import { About } from "./About/About";
import { Actions } from "./Actions/Actions";
import { User } from "./User/User";
import { Cover } from "./Cover/Cover";

export function ProfilePage() {
	return (
		<>
			<section className="profile">
				<div className="subsection">
					<Cover />

					<User />

					<Actions />
				</div>

				<div className="subsection">
					<About />
				</div>

				<div className="subsection">
					<PostsContainer />
				</div>
			</section>
		</>
	);
}
