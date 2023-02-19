import React, { useState } from "react";

export function Messages() {
	const [readMessages, setReadMessages] = useState(
		localStorage.getItem("readMessages") === "false" ? false : true
	);

	function onClickHandler() {
		setReadMessages((prev) => !prev);
		localStorage.setItem("readMessages", !readMessages + "");
	}
	return (
		<>
			<div className="settings__item">
				<h3 className="settings__category">Messages</h3>
				<button onClick={() => onClickHandler()} className="settings__button">
					Read messages: {readMessages ? "on" : " off"}
				</button>
			</div>
		</>
	);
}
