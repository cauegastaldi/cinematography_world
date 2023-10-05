import Resizer from "react-image-file-resizer";

const resizeImage = async (image) => {
	return new Promise((resolve) => {
		Resizer.imageFileResizer(
			image,
			400,
			400,
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
