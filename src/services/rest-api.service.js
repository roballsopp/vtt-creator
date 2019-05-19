import { ApiURL } from '../config';

export const getUploadUrl = async () => {
	const resp = await fetch(`${ApiURL}/upload`);
	return resp.json();
};

export const uploadFile = async (file, url, onProgress) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		if (onProgress) xhr.upload.addEventListener('progress', onProgress);

		xhr.upload.addEventListener('load', resolve);
		xhr.upload.addEventListener('error', reject);
		xhr.upload.addEventListener('abort', reject);

		xhr.open('PUT', url);
		xhr.send(file);
	});
};

export const getTextFromSpeech = async filename => {
	await fetch(`${ApiURL}/text-from-speech/${filename}`);
	// const { url } = await resp.json();
	// return url;
};
