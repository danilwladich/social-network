import React from "react";
import "./ProfilePage.css";
import { User } from "./User/User";
import PostsContainer from "./Posts/PostsContainer";
import { About } from "./About/About";
import { Actions } from "./Actions/Actions";

export function ProfilePage() {
	return (
		<>
			<section className="profile">
				<div className="subsection">
					<User />

					<Actions />
				</div>

				<div className="subsection nf">
					<About />
				</div>

				<div className="subsection">
					<PostsContainer />
				</div>
			</section>
		</>
	);
}
