import multer from "multer";

const uploader = multer({ dest: "public/uploads" });

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
