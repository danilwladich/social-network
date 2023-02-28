import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Chat } from "./Chat";
import { useParams } from "react-router-dom";
import { ChatLoading } from "./ChatLoading";
import { useAppSelector } from "./../../../../hooks/useAppSelector";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import { fetchChatTC } from "../../../../redux/reducers/messagesReducer";

export function ChatContainerAPI() {
	const dispatch = useAppDispatch();

	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [contentLock, setContentLock] = useState(true);

	const contentRef = useRef<HTMLDivElement>(null);

	const { messagesTotalCount: totalCount, messagesPageSize: pageSize } =
		useAppSelector((state) => state.messages);
	const { nickname: chatWithNickname } = useAppSelector(
		(state) => state.messages.chatWith
	);

	const userNickname = useParams().nickname;

	const pagesCount = Math.ceil(totalCount / pageSize);
	const pages: number[] = [];
	for (let i = 1; i <= pagesCount; i++) {
		pages.push(i);
	}

	// pagination and scroll lock
	useEffect(() => {
		const content = contentRef.current;

		function scrollHandler() {
			if (content !== null) {
				// set current page based on scrollTop
				if (
					pagesCount > 0 &&
					currentPage !== pagesCount &&
					!isLoading &&
					content.scrollTop <= content.clientHeight
				) {
					setCurrentPage((prev) => prev + 1);
				}

				// set content lock based on scrollTop
				if (
					content.scrollHeight - (content.scrollTop + content.clientHeight) >
					50
				) {
					setContentLock(false);
				} else if (
					content.scrollHeight - (content.scrollTop + content.clientHeight) ===
					0
				) {
					setContentLock(true);
				}
			}
		}

		content?.addEventListener("scroll", scrollHandler);
		return () => content?.removeEventListener("scroll", scrollHandler);
	}, [isLoading, currentPage, pagesCount]);

	// fetching
	useLayoutEffect(() => {
		if (userNickname) {
			setIsLoading(true);
			dispatch(
				fetchChatTC({ userNickname, page: currentPage, pageSize })
			).finally(() => {
				setIsLoading(false);
			});
		}
	}, [userNickname, currentPage, pageSize, dispatch]);

	if (isLoading && currentPage === 1) {
		return <ChatLoading />;
	}

	if (!chatWithNickname) {
		return <div className="messages__not_found">User not found</div>;
	}

	return (
		<>
			<Chat isLoading={isLoading} contentRef={contentRef} contentLock={contentLock} />
		</>
	);
}

export default ChatContainerAPI;
