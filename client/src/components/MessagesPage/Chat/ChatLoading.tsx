import React from "react";

export function ChatLoading() {
	return (
		<>
			<div className="messages__loading_chat">
				<div className="messages__loading_chat_header">
					<div className="messages__loading_chat_back loading_element"></div>
					<div className="messages__loading_chat_name loading_element"></div>
					<div className="messages__loading_chat_image loading_element"></div>
				</div>

				<div className="messages__loading_chat_content"></div>

				<div className="messages__loading_chat_field">
					<div className="messages__loading_chat_input loading_element"></div>
					<div className="messages__loading_chat_send loading_element"></div>
				</div>
			</div>
		</>
	);
}
