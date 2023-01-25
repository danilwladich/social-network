import React from "react";

export function LoadingCircle() {
	return (
		<>
			<svg
				className="loadingCircle"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid"
			>
				<circle
					cx="50"
					cy="50"
					fill="none"
					strokeWidth="10"
					r="40"
					strokeDasharray="117.80972450961724 41.269908169872416"
				>
					<animateTransform
						attributeName="transform"
						type="rotate"
						repeatCount="indefinite"
						dur="1s"
						values="0 50 50;360 50 50"
						keyTimes="0;1"
					></animateTransform>
				</circle>
			</svg>
		</>
	);
}
