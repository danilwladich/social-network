import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IState } from "../../../../models/IState";
import { connect } from "react-redux";
import { Chat } from "./Chat";
import { readMessages, sendMessage } from "../../../../redux/messagesReducer";
import { useParams } from "react-router-dom";
import { MessagesMessageData } from "../../../../models/Messages/MessagesMessageData";
import { ChatWith } from "../../../../models/Messages/ChatWith";
import { getChatTC } from ".././../../../redux/messagesReducer";
import { ChatLoading } from "./ChatLoading";

interface IProps {
	authNickname: string;
	chatWith: ChatWith;
	messagesData: MessagesMessageData[];
	pageSize: number;
	totalCount: number;
	bodyTheme: string;
	getChatTC: (
		userNickname: string,
		page: number,
		pageSize: number
	) => Promise<void>;
	sendMessage: (message: string, id: string) => void;
	readMessages: (userNickname: string) => void;
}

export function ChatContainerAPI(props: IProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [contentLock, setContentLock] = useState(true);
	const contentRef = useRef<HTMLDivElement>(null);
	const userNickname = useParams().nickname;

	const pagesCount = Math.ceil(props.totalCount / props.pageSize);
	const pages: number[] = [];
	for (let i = 1; i <= pagesCount; i++) {
		pages.push(i);
	}

	// pagination and scroll lock
	useEffect(() => {
		contentRef.current?.addEventListener("scroll", scrollHandler);
		return () => {
			// eslint-disable-next-line
			contentRef.current?.removeEventListener("scroll", scrollHandler);
		};
		// eslint-disable-next-line
	}, [isLoading, currentPage, pagesCount]);
	function scrollHandler() {
		if (contentRef.current !== null) {
			// set current page based on scrollTop
			if (
				pagesCount > 0 &&
				currentPage !== pagesCount &&
				!isLoading &&
				contentRef.current.scrollTop <= contentRef.current.clientHeight
			) {
				setCurrentPage((prev) => prev + 1);
			}

			// set content lock based on scrollTop
			if (
				contentRef.current.scrollHeight -
					(contentRef.current.scrollTop + contentRef.current.clientHeight) >
				50
			) {
				setContentLock(false);
			} else if (
				contentRef.current.scrollHeight -
					(contentRef.current.scrollTop + contentRef.current.clientHeight) ===
				0
			) {
				setContentLock(true);
			}
		}
	}

	useLayoutEffect(() => {
		if (!!userNickname) {
			setIsLoading(true);
			props.getChatTC(userNickname, currentPage, props.pageSize).finally(() => {
				setIsLoading(false);
			});
		}
		// eslint-disable-next-line
	}, [currentPage, props.pageSize]);

	if (isLoading && currentPage === 1) {
		return <ChatLoading />;
	}
	if (!props.chatWith.nickname) {
		return <div className="messages__not_found">User not found</div>;
	}
	return (
		<>
			<Chat {...props} contentRef={contentRef} contentLock={contentLock} />
		</>
	);
}

function mapStateToProps(state: IState) {
	return {
		authNickname: state.auth.user.nickname,
		chatWith: state.messages.chatWith,
		messagesData: state.messages.messagesData,
		pageSize: state.messages.pageSize,
		totalCount: state.messages.totalCount,
		bodyTheme: state.settings.bodyTheme,
	};
}

export const ChatContainer = connect(mapStateToProps, {
	getChatTC,
	sendMessage,
	readMessages,
})(ChatContainerAPI);
