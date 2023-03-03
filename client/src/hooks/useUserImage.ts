import { useAppSelector } from "./useAppSelector";

export function useUserImage(image?: string, small?: boolean) {
	const { bodyTheme } = useAppSelector((state) => state.settings);

	let userImage = "";

	if (image) {
		if (small) {
			userImage = image.split(".jpg")[0] + "&size=small.jpg";
		} else {
			userImage = image;
		}
	} else {
		userImage = `/images/user&theme=${bodyTheme}.jpg`;
	}

	return userImage;
}
