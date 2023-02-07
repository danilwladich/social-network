import React, { useLayoutEffect, useState } from "react";
import "./app.css";
import { Route, Routes } from "react-router-dom";
import { HeaderContainer } from "./components/Header/HeaderContainer";
import { NavBarContainer } from "./components/NavBar/NavBarContainer";
import { connect } from "react-redux";
import { initializationTC } from "./redux/appReducer";
import { IState } from "./models/IState";
import { ErrorContainer } from "./components/Error/ErrorContainer";
import { NotExist } from "./components/NotExist/NotExist";
import { AppLoading } from "./components/assets/AppLoading";
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
const NewsPageContainer = React.lazy(
	() => import("./components/NewsPage/NewsPageContainer")
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

let baseURL;
if (process.env.NODE_ENV === "production") {
	baseURL = "http://46.41.137.197";
} else {
	baseURL = "http://localhost:80";
}

export const socket = io.connect(baseURL, { autoConnect: false });

interface IProps {
	authUser: {
		id: string;
		token: string;
	};
	initializationTC: () => Promise<void>;
}

function App(props: IProps) {
	document.title = `SocNet`;
	const [initializationSuccess, setInitializationSuccess] = useState(false);

	const authUser = props.authUser;

	useLayoutEffect(() => {
		props.initializationTC().finally(() => setInitializationSuccess(true));

		if (!!authUser.id && !!authUser.token) {
			socket.connect();
			socket.emit("connected", {
				nickname: authUser.id,
				token: authUser.token,
			});
		}
		// eslint-disable-next-line
	}, [authUser.id]);

	if (!initializationSuccess) {
		return <AppLoading />;
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
							<React.Suspense fallback={<AppLoading />}>
								<LoginPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/register"
						element={
							<React.Suspense fallback={<AppLoading />}>
								<RegisterPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/:id?"
						element={
							<React.Suspense fallback={<AppLoading />}>
								<ProfilePageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/news"
						element={
							<React.Suspense fallback={<AppLoading />}>
								<NewsPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/messages/:id?"
						element={
							<React.Suspense fallback={<AppLoading />}>
								<MessagesPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/friends/:id?/:category?"
						element={
							<React.Suspense fallback={<AppLoading />}>
								<FriendsPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/users"
						element={
							<React.Suspense fallback={<AppLoading />}>
								<UsersPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/settings"
						element={
							<React.Suspense fallback={<AppLoading />}>
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
	};
}

export default connect(mapStateToProps, {
	initializationTC,
})(App);
