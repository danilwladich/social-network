import React from "react";
import { Navigate, NavLink } from "react-router-dom";
import "../LoginPage.css";
import { RegisterForm } from "./RegisterForm";

interface IProps {
	isAuth: boolean;
	authNickname: string;
	bodyTheme: string;
	registerTC: (
		phoneNumber: string,
		password: string,
		firstName: string,
		lastName: string,
		recaptcha: string
	) => Promise<void>;
}

export function RegisterPage(props: IProps) {
	document.title = `Register`;
	if (props.isAuth) {
		return <Navigate to={"/" + props.authNickname} />;
	}
	return (
		<>
			<section className="login">
				<div className="login__tagline">
					<h3>
						Blo<span>xx</span> its <span>future</span>
					</h3>
					<p>
						<NavLink to="/login">Login</NavLink> or{" "}
						<NavLink to="/register">register</NavLink> now for free
					</p>
				</div>

				<div className="subsection">
					<h2 className="login__title title">Register</h2>

					<RegisterForm
						registerTC={props.registerTC}
						bodyTheme={props.bodyTheme}
					/>

					<NavLink to="/login" className="login__link">
						Already have account?
					</NavLink>
				</div>
			</section>
		</>
	);
}
