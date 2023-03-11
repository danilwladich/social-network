import React, { useEffect } from "react";
import { socket } from "../../../App";
import { CloseX } from "../../assets/svg/CloseX";
import "./Error.css";
import { useAppDispatch } from "./../../../hooks/useAppDispatch";
import { setErrorMessage } from "../../../redux/reducers/appReducer";
import { useAppSelector } from "./../../../hooks/useAppSelector";

export default function Error() {
	const dispatch = useAppDispatch();

	const { errorMessage } = useAppSelector((state) => state.app);

	useEffect(() => {
		socket.on("error", (data) => {
			dispatch(setErrorMessage(data.statusText));
		});

		socket.on("disconnect", (reason) => {
			dispatch(setErrorMessage("Connection error. Try to refresh page"));
		});

		return () => {
			socket.off("error");
			socket.off("disconnect");
		};
	}, [dispatch]);

	useEffect(() => {
		if (errorMessage) {
			const timer = setTimeout(() => {
				dispatch(setErrorMessage(""));
			}, errorMessage.length * 200);
			return () => clearTimeout(timer);
		}
	}, [errorMessage, dispatch]);

	return (
		<>
			<div className={"error " + (errorMessage ? "active" : "")}>
				{!!errorMessage && (
					<>
						<span className="error__message">{errorMessage}</span>
						<button
							tabIndex={1}
							onClick={() => dispatch(setErrorMessage(""))}
							className="error__close"
						>
							<CloseX />
						</button>
					</>
				)}
			</div>
		</>
	);
}
