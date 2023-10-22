import React, { useEffect } from "react";
import "./ImagesModal.css";
import Slider, { Settings, CustomArrowProps } from "react-slick";
import { useAppSelector } from "./../../../hooks/useAppSelector";
import { useAppDispatch } from "./../../../hooks/useAppDispatch";
import { setImages } from "../../../redux/reducers/imagesReducer";
import { CloseX } from "../../assets/svg/CloseX";

export default function ImagesModal() {
	const dispatch = useAppDispatch();

	const { images, current } = useAppSelector((state) => state.images);

	const settings: Settings = {
		dots: images.length > 1,
		arrows: true,
		infinite: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		initialSlide: current,
		nextArrow: <Arrow rotate="-90deg" />,
		prevArrow: <Arrow rotate="90deg" />,
		responsive: [
			{
				breakpoint: 767,
				settings: {
					arrows: false,
				},
			},
		],
	};

	// body scroll lock
	useEffect(() => {
		const body = document.querySelector("body");

		if (images.length) {
			body?.classList.add("lock");
		} else {
			body?.classList.remove("lock");
		}
	}, [images]);

	// hide modal on esc press
	useEffect(() => {
		function keyDownHandler(e: KeyboardEvent) {
			if (e.key === "Escape") {
				onClose();
			}
		}

		window.addEventListener("keydown", keyDownHandler);
		return () => window.removeEventListener("keydown", keyDownHandler);
	}, [images]);

	function onClose() {
		dispatch(setImages({ images: [], current: 0 }));
	}

	return (
		<>
			{!!images.length && (
				<>
					<div
						onClick={() => onClose()}
						className="imagesModal__bg modal__bg"
					/>
					<div className="imagesModal">
						<button
							onClick={() => onClose()}
							tabIndex={1}
							className="imagesModal__close"
						>
							<CloseX />
						</button>

						<Slider {...settings}>
							{images.map((image, index) => (
								<div key={index} className="imagesModal__image">
									<img src={image} alt={index + ""} />
								</div>
							))}
						</Slider>
					</div>
				</>
			)}
		</>
	);
}

function Arrow(props: { rotate: string } & CustomArrowProps) {
	const { className, style, onClick, rotate } = props;
	return (
		<button className={className} style={{ ...style }} onClick={onClick}>
			<svg
				fill="#ffffff"
				viewBox="0 0 32 32"
				xmlns="http://www.w3.org/2000/svg"
				stroke="#ffffff"
				style={{ rotate }}
			>
				<path d="M0.256 8.606c0-0.269 0.106-0.544 0.313-0.75 0.412-0.412 1.087-0.412 1.5 0l14.119 14.119 13.913-13.912c0.413-0.412 1.087-0.412 1.5 0s0.413 1.088 0 1.5l-14.663 14.669c-0.413 0.413-1.088 0.413-1.5 0l-14.869-14.869c-0.213-0.213-0.313-0.481-0.313-0.756z"></path>
			</svg>
		</button>
	);
}
