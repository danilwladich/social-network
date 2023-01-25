import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { IState } from "../models/IState";

export function AuthRedirect(Component: (props: any) => JSX.Element) {
	function RedirectComponent(props: any) {
		if (!props.isAuth) {
			return <Navigate to="/login" />;
		} else {
			return <Component {...props} />;
		}
	}

	function mapStateToProps(state: IState) {
		return {
			isAuth: state.auth.isAuth,
		};
	}
	return connect(mapStateToProps, {})(RedirectComponent);
}
