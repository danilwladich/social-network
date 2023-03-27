import React, { useEffect, useState } from "react";
import "./app.css";
import Header from "./components/Common/Header/Header";
import NavBar from "./components/Common/NavBar/NavBar";
import Error from "./components/Common/Error/Error";
import ImagesModal from "./components/Common/ImagesModal/ImagesModal";
import AppRoutes from "./AppRoutes";
import { AppLoading } from "./components/assets/svg/AppLoading";
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

				<ImagesModal />

				<Header />
				<main className="content">
					<NavBar />

					<AppRoutes />
				</main>
			</div>
		</>
	);
}
