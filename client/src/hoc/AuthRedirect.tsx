import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./../hooks/useAppSelector";

export function AuthRedirect({
	children,
}: {
	children: React.ReactElement<any, any>;
}): JSX.Element {
	const { isAuth } = useAppSelector((state) => state.auth);

	if (!isAuth) {
		return <Navigate to="/login" />;
	} else {
		return children;
	}
}
