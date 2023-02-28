import React, { useEffect, useState } from "react";
import "./app.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Common/Header/Header";
import NavBar from "./components/Common/NavBar/NavBar";
import Error from "./components/Common/Error/Error";
import { NotExist } from "./components/Pages/NotExist/NotExist";
import { AppLoading } from "./components/assets/AppLoading";
import * as io from "socket.io-client";
import { useAppHeight } from "./hooks/useAppHeight";
import { Helmet } from "react-helmet";
import { useAppSelector } from "./hooks/useAppSelector";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { setInitializationTC } from "./redux/reducers/appReducer";
import {
	messageDelete,
	receiveMessage,
} from "./redux/reducers/messagesReducer";

const LoginPage = React.lazy(
	() => import("./components/Pages/LoginPage/Login/LoginPage")
);
const RegisterPage = React.lazy(
	() => import("./components/Pages/LoginPage/Register/RegisterPage")
);
const ProfilePageContainer = React.lazy(
	() => import("./components/Pages/ProfilePage/ProfilePageContainer")
);
const NewsPageContainer = React.lazy(
	() => import("./components/Pages/NewsPage/NewsPageContainer")
);
const MessagesPage = React.lazy(
	() => import("./components/Pages/MessagesPage/MessagesPage")
);
const FriendsPageContainer = React.lazy(
	() => import("./components/Pages/FriendsPage/FriendsPageContainer")
);
const UsersPageContainer = React.lazy(
	() => import("./components/Pages/UsersPage/UsersPageContainer")
);
const SettingsPage = React.lazy(
	() => import("./components/Pages/SettingsPage/SettingsPage")
);

// connect socket
let baseURL;
if (process.env.NODE_ENV === "production") {
	baseURL = "http://46.41.137.197";
} else {
	baseURL = "http://localhost:80";
}
export const socket = io.connect(baseURL, { autoConnect: false });

export default function App() {
	const dispatch = useAppDispatch();

	const [initializationSuccess, setInitializationSuccess] = useState(false);

	const { user: authUser } = useAppSelector((state) => state.auth);

	// initialization
	useEffect(() => {
		dispatch(setInitializationTC()).finally(() =>
			setInitializationSuccess(true)
		);

		if (!!authUser.nickname && !!authUser.token) {
			socket.connect();
			socket.emit("connected", {
				nickname: authUser.nickname,
				token: authUser.token,
			});
		}
	}, [authUser.nickname, authUser.token, dispatch]);

	// try to reconnect on disconnect
	useEffect(() => {
		if (!!authUser.nickname && !!authUser.token) {
			socket.on("disconnect", () => {
				setInitializationSuccess(false);
				dispatch(setInitializationTC());

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
	}, [authUser.nickname, authUser.token, initializationSuccess, dispatch]);

	// global sockets
	useEffect(() => {
		socket.on("receiveMessage", (data) => {
			dispatch(
				receiveMessage({
					messageData: data.messageData,
					fromUser: data.fromUser,
				})
			);
		});

		socket.on("messageDelete", (data) => {
			dispatch(
				messageDelete({
					fromUserNickname: data.from,
					messageID: data.messageID,
					penultimateMessageData: data.penultimateMessageData,
				})
			);
		});

		return () => {
			socket.off("receiveMessage");
			socket.off("messageDelete");
		};
	}, [dispatch]);

	// set app height
	useAppHeight();

	if (!initializationSuccess) {
		return <AppLoading />;
	}

	return (
		<>
			<Helmet>
				<title>Bloxx</title>
				<meta
					name="description"
					content="Bloxx is social network to find and chat with your friends"
				/>
			</Helmet>

			<div className="wrapper">
				<Error />
				<Header />
				<main className="content">
					<NavBar />
					<AppRoutes />
				</main>
			</div>
		</>
	);
}

const routes = [
	{
		path: "/login",
		element: <LoginPage />,
		suspense: true,
	},
	{
		path: "/register",
		element: <RegisterPage />,
		suspense: true,
	},
	{
		path: "/:nickname?",
		element: <ProfilePageContainer />,
		suspense: true,
	},
	{
		path: "/news",
		element: <NewsPageContainer />,
		suspense: true,
	},
	{
		path: "/messages/:nickname?",
		element: <MessagesPage />,
		suspense: true,
	},
	{
		path: "/friends/:nickname?/:category?",
		element: <FriendsPageContainer />,
		suspense: true,
	},
	{
		path: "/users",
		element: <UsersPageContainer />,
		suspense: true,
	},
	{
		path: "/settings",
		element: <SettingsPage />,
		suspense: true,
	},
	{
		path: "/*",
		element: <NotExist />,
		suspense: false,
	},
];

function AppRoutes() {
	return (
		<Routes>
			{routes.map((route) =>
				route.suspense ? (
					<Route
						key={route.path}
						path={route.path}
						element={
							<React.Suspense fallback={<AppLoading />}>
								{route.element}
							</React.Suspense>
						}
					/>
				) : (
					<Route key={route.path} path="/*" element={<NotExist />} />
				)
			)}
		</Routes>
	);
}
