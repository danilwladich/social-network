import React, { useEffect, useLayoutEffect, useState } from "react";
import "./app.css";
import { Route, Routes } from "react-router-dom";
import { HeaderContainer } from "./components/Common/Header/HeaderContainer";
import { NavBarContainer } from "./components/Common/NavBar/NavBarContainer";
import { connect } from "react-redux";
import { initializationTC } from "./redux/appReducer";
import { IState } from "./models/IState";
import { ErrorContainer } from "./components/Common/Error/ErrorContainer";
import { NotExist } from "./components/Pages/NotExist/NotExist";
import { AppLoading } from "./components/assets/AppLoading";
import * as io from "socket.io-client";
import { MessagesMessageData } from "./models/Messages/MessagesMessageData";
import { MessagesUserData } from "./models/Messages/MessagesUserData";
import { messageDelete, receiveMessage } from "./redux/messagesReducer";
import { useAppHeight } from "./hooks/useAppHeight";

const LoginPageContainer = React.lazy(
	() => import("./components/Pages/LoginPage/Login/LoginPageContainer")
);
const RegisterPageContainer = React.lazy(
	() => import("./components/Pages/LoginPage/Register/RegisterPageContainer")
);
const ProfilePageContainer = React.lazy(
	() => import("./components/Pages/ProfilePage/ProfilePageContainer")
);
const NewsPageContainer = React.lazy(
	() => import("./components/Pages/NewsPage/NewsPageContainer")
);
const MessagesPageContainer = React.lazy(
	() => import("./components/Pages/MessagesPage/MessagesPageContainer")
);
const FriendsPageContainer = React.lazy(
	() => import("./components/Pages/FriendsPage/FriendsPageContainer")
);
const UsersPageContainer = React.lazy(
	() => import("./components/Pages/UsersPage/UsersPageContainer")
);
const SettingsPageContainer = React.lazy(
	() => import("./components/Pages/SettingsPage/SettingsPageContainer")
);

// connect socket
let baseURL;
if (process.env.NODE_ENV === "production") {
	baseURL = "http://46.41.137.197";
} else {
	baseURL = "http://localhost:80";
}
export const socket = io.connect(baseURL, { autoConnect: false });

interface IProps {
	authUser: {
		nickname: string;
		token: string;
	};
	initializationTC: () => Promise<void>;
	receiveMessage: (
		messageData: MessagesMessageData,
		fromUser: MessagesUserData
	) => void;
	messageDelete: (
		fromUser: string,
		messageID: string,
		penultimateMessageData?: MessagesMessageData
	) => void;
}

function App(props: IProps) {
	document.title = `Bloxx`;
	const [initializationSuccess, setInitializationSuccess] = useState(false);

	const authUser = props.authUser;

	// initialization
	useLayoutEffect(() => {
		props.initializationTC().finally(() => setInitializationSuccess(true));

		if (!!authUser.nickname && !!authUser.token) {
			socket.connect();
			socket.emit("connected", {
				nickname: authUser.nickname,
				token: authUser.token,
			});
		}
		// eslint-disable-next-line
	}, [authUser.nickname]);

	// try to reconnect on disconnect
	useEffect(() => {
		if (!!authUser.nickname && !!authUser.token) {
			socket.on("disconnect", () => {
				setInitializationSuccess(false);
				props.initializationTC();

				setTimeout(() => {
					socket.connect();
					socket.emit("connected", {
						nickname: authUser.nickname,
						token: authUser.token,
					});
					setInitializationSuccess(true);
				}, 1000);
			});
		}
		// eslint-disable-next-line
	}, [authUser.nickname, initializationSuccess]);

	// global sockets
	useEffect(() => {
		socket.on("receiveMessage", (data) => {
			props.receiveMessage(data.messageData, data.fromUser);
		});

		socket.on("messageDelete", (data) => {
			props.messageDelete(
				data.from,
				data.messageID,
				data.penultimateMessageData
			);
		});

		return () => {
			socket.off("receiveMessage");
			socket.off("messageDelete");
		};
		// eslint-disable-next-line
	}, []);

	// set app height
	useAppHeight();

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
						path="/:nickname?"
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
						path="/messages/:nickname?"
						element={
							<React.Suspense fallback={<AppLoading />}>
								<MessagesPageContainer />
							</React.Suspense>
						}
					/>
					<Route
						path="/friends/:nickname?/:category?"
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
	receiveMessage,
	messageDelete,
})(App);
