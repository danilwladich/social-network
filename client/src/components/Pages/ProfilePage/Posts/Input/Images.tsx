import React, { useEffect, useState } from "react";
import { FieldRenderProps } from "react-final-form";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { blobToData } from "../../../../../hooks/useBlobToData";
import { setErrorMessage } from "../../../../../redux/reducers/appReducer";
import { CloseX } from "../../../../assets/svg/CloseX";
import { ImageIcon } from "../../../../assets/svg/ImageIcon";
import { LoadingCircle } from "../../../../assets/svg/LoadingCircle";

interface IProps
	extends FieldRenderProps<
		any,
		HTMLElement,
		{
			files?: FileList;
			uploadedImages?: string[];
			isLoading?: boolean;
		}
	> {}

function numberToWord(number: number) {
	const numbers = [
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine",
		"ten",
	];

	return numbers[number - 1];
}

export function Images({ input: { onChange, value, ...input } }: IProps) {
	const dispatch = useAppDispatch();

	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [imagesInLoading, setImagesInLoading] = useState<number[]>([]);

	// clear on form reset
	useEffect(() => {
		if (!value) {
			setUploadedImages([]);
			setImagesInLoading([]);
		}
	}, [value]);

	async function onChangeHandler(files: FileList | null) {
		if (files !== null) {
			// max count of images
			if (
				files.length <= 10 &&
				uploadedImages.length + imagesInLoading.length + files.length <= 10
			) {
				// check mimetype
				if (Array.from(files).every((file) => file.type.split("/")[0] === "image")) {
					// max size of every image
					if (
						Array.from(files).every((file) => file.size <= 10 * 1024 * 1024)
					) {
						const dt = new DataTransfer();

						// add already existing files
						if (value.files?.length) {
							for (let i = 0; i < value.files.length; i++) {
								const file = value.files[i];
								dt.items.add(file);
							}
						}

						// add new files
						for (let i = 0; i < files.length; i++) {
							const file = files[i];
							dt.items.add(file);
						}

						onChange({ ...value, isLoading: true });

						const uploadedImagesArr = await onUploadImages(files);

						onChange({
							...value,
							files: dt.files,
							uploadedImages: value.uploadedImages
								? value.uploadedImages.concat(uploadedImagesArr)
								: uploadedImagesArr,
							isLoading: false,
						});
					} else {
						dispatch(setErrorMessage("Max file size 10 mb"));
					}
				} else {
					dispatch(setErrorMessage("Only images allowed"));
				}
			} else {
				dispatch(setErrorMessage("Max allowed 10 files"));
			}
		}
	}

	async function onUploadImages(files: FileList) {
		// set images in loading
		let inLoading = [];
		for (let i = 0; i < files.length; i++) {
			inLoading.push(i);
		}
		setImagesInLoading(inLoading);

		// upload images
		let uploadedImagesArr = [];

		for (const file of Array.from(files)) {
			const result = await blobToData(file);

			uploadedImagesArr.push(result);

			setUploadedImages((prev) => [...prev, result]);

			// delete one image in loading
			setImagesInLoading((prev) =>
				prev.filter((item) => item !== prev.length - 1)
			);
		}

		return uploadedImagesArr;
	}

	// return property with image src if in array only one image
	function bgSingleImage(): React.CSSProperties {
		let style = {};

		if (uploadedImages.length === 1 && imagesInLoading.length === 0) {
			style = {
				"--post-bg-blur": `url(${uploadedImages[0]})`,
			};
		}

		return style;
	}

	function onImageDelete(index: number) {
		setUploadedImages((prev) => prev.filter((img, i) => index !== i));

		if (value.files?.length) {
			const dt = new DataTransfer();

			for (let i = 0; i < value.files.length; i++) {
				const file = value.files[i];
				if (index !== i) {
					dt.items.add(file);
				}
			}

			onChange({
				...value,
				files: dt.files,
				uploadedImages: value.uploadedImages?.filter((img, i) => index !== i),
			});
		}
	}

	return (
		<>
			<label
				htmlFor="postImagesInput"
				id="postImagesInputLabel"
				className="profile__posts_input_images_label"
				title="Upload image"
			>
				<ImageIcon />
			</label>

			{uploadedImages.length + imagesInLoading.length > 0 && (
				<div className="profile__posts_input_images_count">
					{uploadedImages.length + imagesInLoading.length}/10
				</div>
			)}

			<input
				{...input}
				id="postImagesInput"
				onChange={(e) => onChangeHandler(e.target.files)}
				type="file"
				multiple
				accept="image/png, image/jpeg"
				style={{ display: "none" }}
			/>

			<div
				className={
					"profile__posts_input_images " +
					(numberToWord(uploadedImages.length + imagesInLoading.length) || "")
				}
				style={bgSingleImage()}
			>
				{uploadedImages.map((image, index) => (
					<div key={index} className="profile__posts_input_image">
						<img src={image} alt={index + ""} />

						<button
							type="button"
							onClick={() => onImageDelete(index)}
							className="profile__posts_input_image_delete"
						>
							<CloseX />
						</button>
					</div>
				))}

				{imagesInLoading.map((item) => (
					<div key={item} className="profile__posts_input_image">
						<div className="profile__posts_input_image_loading">
							<LoadingCircle />
						</div>
					</div>
				))}
			</div>
		</>
	);
}
