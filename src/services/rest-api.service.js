import { ApiURL } from '../config';

export const getUploadUrl = async () => {
	const resp = await fetch(`${ApiURL}/upload`);
	return resp.json();
};

export const uploadFile = async (file, url, onProgress) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		if (onProgress) xhr.upload.addEventListener('progress', onProgress);

		xhr.upload.addEventListener('error', reject);
		xhr.upload.addEventListener('abort', reject);
		xhr.addEventListener('load', resolve);

		xhr.open('PUT', url);
		xhr.send(file);
	});
};

export const initSpeechToTextOp = async filename => {
	const resp = await fetch(`${ApiURL}/speech-to-text/${filename}`, { method: 'POST' });

	if (resp.ok) return await resp.json();
	throw new Error(resp.statusText);
};

export const pollSpeechToTextOp = (operationId, interval = 1000, timeout = 10000) => {
	return new Promise((resolve, reject) => {
		const intervalId = setInterval(async () => {
			const resp = await fetch(`${ApiURL}/speech-to-text/${operationId}`);
			if (resp.ok) {
				const job = await resp.json();

				if (job.done) {
					clearInterval(intervalId);
					resolve(job.results);
				}
			} else {
				clearInterval(intervalId);
				throw new Error(resp.statusText);
			}
		}, interval);

		setTimeout(() => {
			clearInterval(intervalId);
			reject();
		}, timeout);
	});
};
