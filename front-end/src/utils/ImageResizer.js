import Resizer from "react-image-file-resizer";

const resizeImage = async (image, width = 400, height = 400) => {
	return new Promise((resolve) => {
		Resizer.imageFileResizer(
			image,
			width,
			height,
			"JPEG",
			100,
			0,
			(uri) => {
				resolve(uri);
			},
			"file"
		);
	});
};

export default { resizeImage };
