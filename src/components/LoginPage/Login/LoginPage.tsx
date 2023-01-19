import React from "react";
import { Navigate, NavLink } from "react-router-dom";
import "../LoginPage.css";
import { LoginForm } from "./LoginForm";

interface IProps {
	isAuth: boolean;
	authID: string;
	loginTC: (phoneNumber: string, password: string) => Promise<void>;
}

export function LoginPage(props: IProps) {
	document.title = `Login`;
	if (props.isAuth) {
		return <Navigate to={"/" + props.authID} />;
	}
	return (
		<>
			<section className="login">
				<div className="subsection">
					<h2 className="login__title title">Login</h2>
					<LoginForm loginTC={props.loginTC} />
					<NavLink to="/register" className="login__link">
						Don`t have an account yet?
					</NavLink>
				</div>
			</section>
		</>
	);
}
