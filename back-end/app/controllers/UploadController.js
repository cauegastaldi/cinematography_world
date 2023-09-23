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

const uploader = multer({
	dest: "public/uploads",
	fileFilter: uploadFilter,
	limits: { fileSize: MAX_FILE_SIZE },
});

export default async (req, res) => {
	uploader.single("mediaPoster")(req, res, (err) => {
		if (err) {
			res.status(500).json({ error: 1, payload: err });
		} else {
			const image = {};
			image.id = req.file.filename;
			image.url = `/uploads/${image.id}`;
			res.status(200).json({ error: 0, payload: { id: image.id, url: image.url } });
		}
	});
};
