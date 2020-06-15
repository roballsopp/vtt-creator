import { ApiURL, SpeechToTextJobTimeout } from '../config';
import { handleError } from './error-handler.service';

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

export const deleteFile = async filename => {
	const resp = await fetch(`${ApiURL}/files/${filename}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!resp.ok) throw new Error(resp.statusText);
};

export const S2T_REQUEST_COUNT = 'speech_to_text_request_count';

function incrementS2TRequestCount() {
	try {
		const count = localStorage.getItem(S2T_REQUEST_COUNT) || 0;
		localStorage.setItem(S2T_REQUEST_COUNT, parseInt(count) + 1);
	} catch (e) {
		handleError(e);
	}
}

export const initSpeechToTextOp = async (filename, options = {}) => {
	incrementS2TRequestCount();
	const resp = await fetch(`${ApiURL}/speech-to-text/${filename}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(options),
	});

	if (resp.ok) return await resp.json();
	throw new Error(resp.statusText);
};

export const getSpeechToTextLanguages = async () => {
	const resp = await fetch(`${ApiURL}/speech-to-text/languages`);
	if (resp.ok) return await resp.json();
	throw new Error(resp.statusText);
};

export const pollSpeechToTextOp = (operationId, interval = 1000, timeout = SpeechToTextJobTimeout) => {
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
				reject(new Error(resp.statusText));
			}
		}, interval);

		setTimeout(() => {
			clearInterval(intervalId);
			reject(new Error('Poll timeout exceeded.'));
		}, timeout);
	});
};

export const createStripeSession = async ({ name, description, amount, returnUrl }) => {
	const resp = await fetch(`${ApiURL}/stripe/session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, description, amount, returnUrl }),
	});

	if (resp.ok) return await resp.json();
	throw new Error(resp.statusText);
};
