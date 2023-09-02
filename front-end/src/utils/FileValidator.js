const validFileExtensions = { image: ["jpg", "png", "jpeg"] };
const MAX_FILE_SIZE = 5242880;

const isValidFileType = (fileName, fileType) => {
	return fileName && validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1;
};

const isValidSize = (fileSize) => {
	return fileSize <= MAX_FILE_SIZE;
};

const acceptedTypes = () => {
	let acceptedTypes = "";
	validFileExtensions.image.forEach((type) => {
		acceptedTypes += `${type}, `;
	});
	acceptedTypes = acceptedTypes.substring(0, acceptedTypes.length - 2);
	return acceptedTypes;
};

const maxFileSizeInMb = () => {
	return `${MAX_FILE_SIZE / 1024 ** 2} MB`;
};

export default { isValidFileType, isValidSize, acceptedTypes, maxFileSizeInMb };
