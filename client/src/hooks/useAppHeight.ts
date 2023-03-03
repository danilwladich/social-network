import { useEffect } from "react";

// set app height
function appHeight() {
	const doc = document.documentElement;
	doc.style.setProperty("--app-height", `${window.innerHeight}px`);
}
appHeight();

export function useAppHeight() {
	useEffect(() => {
		window.addEventListener("resize", appHeight);
		return () => window.removeEventListener("resize", appHeight);
	}, []);
}
