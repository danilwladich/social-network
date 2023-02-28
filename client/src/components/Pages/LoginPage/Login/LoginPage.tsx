import React from "react";
import { Navigate, NavLink } from "react-router-dom";
import "../LoginPage.css";
import { LoginForm } from "./LoginForm";
import { Helmet } from "react-helmet";
import { useAppSelector } from "./../../../../hooks/useAppSelector";

export default function LoginPage() {
	const { isAuth, user: authUser } = useAppSelector((state) => state.auth);
	if (isAuth) {
		return <Navigate to={"/" + authUser.nickname} />;
	}

	return (
		<>
			<Helmet>
				<title>Login</title>
			</Helmet>

			<section className="login">
				<div className="login__tagline_wrapper">
					<div className="login__tagline">
						<h3>
							Blo<span>xx</span> its <span>future</span>
						</h3>
						<p>
							<NavLink to="/login">Login</NavLink> or{" "}
							<NavLink to="/register">register</NavLink> now for free
						</p>
					</div>
				</div>

				<div className="subsection">
					<h2 className="login__title title">Login</h2>

					<LoginForm />

					<NavLink to="/register" className="login__link">
						Don`t have an account yet?
					</NavLink>
				</div>
			</section>
		</>
	);
}
