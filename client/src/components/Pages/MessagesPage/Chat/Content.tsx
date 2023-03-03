import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { socket } from "../../../../App";
import { Message } from "./Message/Message";
import { useAppSelector } from "./../../../../hooks/useAppSelector";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import {
	deleteMessageTC,
	readMessages,
} from "../../../../redux/reducers/messagesReducer";
import { LoadingCircle } from "../../../assets/svg/LoadingCircle";

interface IProps {
	isLoading: boolean;
	contentRef: React.RefObject<HTMLDivElement>;
	contentLock: boolean;
}

export function Content(props: IProps) {
	const dispatch = useAppDispatch();

	const [deleteButtonsInProgress, setDeleteButtonsInProgress] = useState<
		string[]
	>([]);

	const messagesEnd = useRef<HTMLDivElement>(null);

	const { chatWith, messagesData } = useAppSelector((state) => state.messages);
	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);

	const reverseMessageData = [...messagesData].reverse();
	const readMessagesOption =
		localStorage.getItem("readMessages") === "false" ? false : true;

	// first render scroll bottom
	useLayoutEffect(() => {
		scrollBottom();
	}, []);

	// scroll bottom after get and send messages + read messages socket
	useEffect(() => {
		if (!!messagesData.length) {
			if (props.contentLock) {
				scrollBottom();
			}

			if (readMessagesOption && !messagesData[0].read) {
				socket.emit("readMessages", {
					who: authNickname,
					whom: chatWith.nickname,
				});

				dispatch(readMessages(chatWith.nickname));
			}
		}
	}, [
		messagesData,
		authNickname,
		props.contentLock,
		chatWith.nickname,
		readMessagesOption,
		dispatch,
	]);
	function scrollBottom() {
		messagesEnd.current?.scrollIntoView();
	}

	// return date if message before has a different date or this is the first message
	function checkMessageDate(index: number) {
		if (reverseMessageData[index]) {
			const date = reverseMessageData[index].date.split(" ");
			const dateBefore = reverseMessageData[index - 1]?.date.split(" ");

			if (
				(dateBefore &&
					date.slice(0, 3).join(" ") !== dateBefore.slice(0, 3).join(" ")) ||
				index === 0
			) {
				const dateNow = new Date().toString().split(" ").slice(1, 5);

				const year = date[2];
				const yearNow = dateNow[2];
				const month = date[0];
				const monthNumber =
					new Date(Date.parse(reverseMessageData[index].date)).getMonth() + 1;
				const monthNumberNow = new Date().getMonth() + 1;
				const day = date[1];
				const dayNow = dateNow[1];

				let dateToShow;

				if (+year === +yearNow) {
					if (+day === +dayNow && monthNumber === monthNumberNow) {
						dateToShow = "Today";
					} else {
						dateToShow = `${day} ${month}`;
					}
				} else {
					dateToShow = `${day} ${month} ${year}`;
				}

				return dateToShow;
			}
		}
	}

	// return class name for message depending on neighboring messages
	function checkMessagesRow(index: number): "first" | "middle" | "last" {
		if (!checkMessageDate(index)) {
			if (reverseMessageData[index].out) {
				if (
					reverseMessageData[index - 1]?.out &&
					reverseMessageData[index + 1]?.out &&
					!checkMessageDate(index + 1)
				) {
					return "middle";
				}
				if (reverseMessageData[index - 1]?.out) {
					return "last";
				}
			} else {
				if (
					!reverseMessageData[index - 1]?.out &&
					!reverseMessageData[index + 1]?.out &&
					!checkMessageDate(index + 1)
				) {
					return "middle";
				}
				if (!reverseMessageData[index - 1]?.out) {
					return "last";
				}
			}
		}
		return "first";
	}

	// delete message
	async function deleteMessage(messageID: string) {
		setDeleteButtonsInProgress((prev) => [...prev, messageID]);

		const { meta } = await dispatch(deleteMessageTC(messageID));

		if (meta.requestStatus === "fulfilled") {
			socket.emit("deleteMessage", {
				from: authNickname,
				to: chatWith.nickname,
				messageID,
				// return penultimate message if the deleted message was the last one
				penultimateMessageData:
					messagesData[0].id === messageID ? messagesData[1] : undefined,
			});
		}

		setDeleteButtonsInProgress((prev) => prev.filter((id) => id !== messageID));
	}

	return (
		<>
			<div className="messages__chat_content" ref={props.contentRef}>
				{!!messagesData.length ? (
					<>
						{props.isLoading && (
							<div className="messages__chat_content_loading">
								<LoadingCircle />
							</div>
						)}

						{reverseMessageData.map((message, index) => (
							<Message
								key={message.id}
								messageData={message}
								index={index}
								date={checkMessageDate(index)}
								rowClassName={checkMessagesRow(index)}
								deleteButtonInProgress={deleteButtonsInProgress.some(
									(id) => id === message.id
								)}
								deleteMessage={() => deleteMessage(message.id)}
							/>
						))}

						<div style={{ float: "left", clear: "both" }} ref={messagesEnd} />
					</>
				) : (
					<div className="messages__chat_content_no_content">
						{`You haven't had chat with ${chatWith.firstName} ${chatWith.lastName} yet`}
					</div>
				)}
			</div>
		</>
	);
}
