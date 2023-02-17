import React from "react";
import { Navigate, NavLink } from "react-router-dom";
import "../LoginPage.css";
import { LoginForm } from "./LoginForm";

interface IProps {
	isAuth: boolean;
	authNickname: string;
	bodyTheme: string;
	loginTC: (
		phoneNumber: string,
		password: string,
		recaptcha: string
	) => Promise<void>;
}

export function LoginPage(props: IProps) {
	document.title = `Login`;
	if (props.isAuth) {
		return <Navigate to={"/" + props.authNickname} />;
	}
	return (
		<>
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

					<LoginForm loginTC={props.loginTC} bodyTheme={props.bodyTheme} />

					<NavLink to="/register" className="login__link">
						Don`t have an account yet?
					</NavLink>
				</div>
			</section>
		</>
	);
}
