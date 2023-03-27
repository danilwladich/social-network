import React from "react";
import { Navigate, NavLink } from "react-router-dom";
import "../LoginPage.css";
import { RegisterForm } from "./RegisterForm";
import { Helmet } from "react-helmet";
import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function RegisterPage() {
	const { isAuth, user: authUser } = useAppSelector((state) => state.auth);
	if (isAuth) {
		return <Navigate to={"/" + authUser.nickname} />;
	}
	
	return (
		<>
			<Helmet>
				<title>Register</title>
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
					<h2 className="login__title">Register</h2>

					<RegisterForm />

					<NavLink to="/login" className="login__link">
						Already have account?
					</NavLink>
				</div>
			</section>
		</>
	);
}
