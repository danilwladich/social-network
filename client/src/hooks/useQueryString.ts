import { useLocation } from "react-router-dom";

export function useQueryString(searchName: string) {
	const query = useLocation().search.slice(1).split("&_");

	let result: string | undefined = undefined;

	query.every((q) => {
		const index = q.indexOf("=");

		const queryName = [q.slice(0, index), q.slice(index + 1)];

		if (queryName[0] === searchName) {
			result = queryName[1];
			return false;
		}
		
		return true;
	});

	return result;
}
