import React, { useLayoutEffect } from "react";
import "./app.css";
import { Route, Routes } from "react-router-dom";
import { HeaderContainer } from "./components/Header/HeaderContainer";
import { NavBarContainer } from "./components/NavBar/NavBarContainer";
import { connect } from "react-redux";
import { initializationTC } from "./redux/appReducer";
import { IState } from "./models/IState";
import { ErrorContainer } from "./components/Error/ErrorContainer";
import { NotExist } from "./components/NotExist/NotExist";
import * as io from "socket.io-client";

const LoginPageContainer = React.lazy(
	() => import("./components/LoginPage/Login/LoginPageContainer")
);
const RegisterPageContainer = React.lazy(
	() => import("./components/LoginPage/Register/RegisterPageContainer")
);
const ProfilePageContainer = React.lazy(
	() => import("./components/ProfilePage/ProfilePageContainer")
);
const MessagesPageContainer = React.lazy(
	() => import("./components/MessagesPage/MessagesPageContainer")
);
const FriendsPageContainer = React.lazy(
	() => import("./components/FriendsPage/FriendsPageContainer")
);
const UsersPageContainer = React.lazy(
	() => import("./components/UsersPage/UsersPageContainer")
);
const SettingsPageContainer = React.lazy(
	() => import("./components/SettingsPage/SettingsPageContainer")
);

export const socket = io.connect("http://localhost:80", { autoConnect: false });

interface IProps {
	authUser: {
		id: string;
		token: string;
	};
	initializationSuccess: boolean;
	initializationTC: () => Promise<void>;
}

// TODO add fallback for suspense
// TODO add fallback for suspense
// TODO add fallback for suspense

function App(props: IProps) {
	document.title = `SocNet`;

	const authUser = props.authUser;

	useLayoutEffect(() => {
		props.initializationTC();
		
		if (!!authUser.id && !!authUser.token) {
			socket.connect()
			socket.emit("connected", {
				nickname: authUser.id,
				token: authUser.token,
			});
		}
		// eslint-disable-next-line
	}, [authUser.id]);

	if (!props.initializationSuccess) {
		return (
			<div className="app_loading">
				<div></div>
				<div></div>
			</div>
		);
	}
	return (
		<div className="wrapper">
			<ErrorContainer />
			<HeaderContainer />
			<main className="content">
				<NavBarContainer />
				<Routes>
					<Route
						path="/login"
						element={
							<React.Suspense>
								<LoginPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/register"
						element={
							<React.Suspense>
								<RegisterPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/:id?"
						element={
							<React.Suspense>
								<ProfilePageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/messages/:id?"
						element={
							<React.Suspense>
								<MessagesPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/friends/:id?/:category?"
						element={
							<React.Suspense>
								<FriendsPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/users"
						element={
							<React.Suspense>
								<UsersPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/settings"
						element={
							<React.Suspense>
								<SettingsPageContainer />
							</React.Suspense>
						}
					/>
					<Route path="/*" element={<NotExist />} />
				</Routes>
			</main>
		</div>
	);
}

function mapStateToProps(state: IState) {
	return {
		authUser: state.auth.user,
		initializationSuccess: state.app.initializationSuccess,
	};
}

export default connect(mapStateToProps, {
	initializationTC,
})(App);
