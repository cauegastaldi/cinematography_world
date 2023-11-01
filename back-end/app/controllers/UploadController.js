import multer from "multer";
import mime from "mime";

const MAX_FILE_SIZE = 5242880;

const uploadFilter = (req, file, cb) => {
	const type = mime.extension(file.mimetype);

	const acceptedTypes = ["png", "jpg", "jpeg"];

	if (acceptedTypes.includes(`${type}`)) {
		cb(null, true);
	} else {
		cb(
			`Imagens .${type} não são aceitas. Por favor, envie uma imagem com um tipo aceito.`,
			false
		);
	}
};

const posterUploader = multer({
	dest: "public/uploads/posters",
	fileFilter: uploadFilter,
	limits: { fileSize: MAX_FILE_SIZE },
});

const userImageUploader = multer({
	dest: "public/uploads/userImages",
	fileFilter: uploadFilter,
});

export const uploadPosterImage = async (req, res) => {
	posterUploader.single("mediaPoster")(req, res, (err) => {
		if (err) {
			res.status(500).json({ error: 1, payload: err });
		} else {
			const image = {};
			image.id = req.file.filename;
			image.url = `/uploads/posters/${image.id}`;
			res.status(200).json({ error: 0, payload: { id: image.id, url: image.url } });
		}
	});
};

export const uploadUserImage = async (req, res) => {
	userImageUploader.single("userImage")(req, res, (err) => {
		if (err) {
			res.status(500).json({ error: 1, payload: err });
		} else {
			const image = {};
			image.id = req.file.filename;
			image.url = `/uploads/userImages/${image.id}`;
			res.status(200).json({ error: 0, payload: { id: image.id, url: image.url } });
		}
	});
};
