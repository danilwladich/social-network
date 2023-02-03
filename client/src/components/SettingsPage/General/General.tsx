import React from "react";

interface IProps {
	bodyTheme: string;
	setTheme: (v: string) => void;
}

export function General(props: IProps) {
	return (
		<>
			<div className="settings__item">
				<h3 className="settings__category">General</h3>
				{props.bodyTheme === "light" ? (
					<button
						onClick={() => {
							props.setTheme("dark");
						}}
						className="settings__button"
					>
						Theme color
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M19.5761 14.5765C18.7677 14.8513 17.9013 15.0003 17 15.0003C12.5817 15.0003 9 11.4186 9 7.00029C9 6.09888 9.14908 5.23229 9.42394 4.42383C6.26952 5.49607 4 8.48301 4 12C4 16.4183 7.58172 20 12 20C15.5169 20 18.5037 17.7307 19.5761 14.5765Z"
								strokeWidth="1"
								strokeLinecap="round"
								strokeLinejoin="round"
							></path>
						</svg>
					</button>
				) : (
					<button
						onClick={() => {
							props.setTheme("light");
						}}
						className="settings__button"
					>
						Theme color
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M5 12H3M12 5V3M21 12H19M12 21V19M16.9496 16.9498L18.3638 18.364M5.63602 5.63608L7.05023 7.05029M16.9496 7.0502L18.3638 5.63599M5.63602 18.3639L7.05023 16.9497M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
								strokeWidth="1"
								strokeLinecap="round"
								strokeLinejoin="round"
							></path>{" "}
						</svg>
					</button>
				)}
			</div>
		</>
	);
}
