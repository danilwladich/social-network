import { useEffect } from "react";

function urlify(text: string) {
	const urlRegex =
		/https?:\/\/[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/g;
	return text.replace(urlRegex, (url) => {
		return '<a href="' + url + '" target="_blank">' + url + "</a>";
	});
}

export function useUrlifyText(text: string, ref: React.RefObject<HTMLElement>) {
	const urlifyText = urlify(text);

	useEffect(() => {
		if (urlifyText !== text && ref.current !== null) {
			ref.current.innerHTML = urlifyText;
		}
	}, [text, ref, urlifyText]);
}
