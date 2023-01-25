import React from "react";
import { Navigate, NavLink } from "react-router-dom";
import "../LoginPage.css";
import { RegisterForm } from "./RegisterForm";

interface IProps {
	isAuth: boolean;
	authID: string;
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
		return <Navigate to={"/" + props.authID} />;
	}
	return (
		<>
			<section className="login">
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
