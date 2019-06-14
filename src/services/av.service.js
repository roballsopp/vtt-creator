const encodeWAV = require('audiobuffer-to-wav');

const SAMPLE_RATE = 44100;

export const getAudioBlobFromVideo = async file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.addEventListener('load', async () => {
			try {
				const decodeCtx = new AudioContext({ sampleRate: SAMPLE_RATE });
				const decodedBuffer = await decodeCtx.decodeAudioData(reader.result);
				// TODO: all this garbage just to convert to mono...i think...improvements?
				const offlineCtx = new OfflineAudioContext(1, decodedBuffer.length, SAMPLE_RATE);
				const soundSource = offlineCtx.createBufferSource();
				soundSource.buffer = decodedBuffer;
				soundSource.connect(offlineCtx.destination);
				soundSource.start();
				const audioBuffer = await offlineCtx.startRendering();
				resolve(encodeWAV(audioBuffer));
			} catch (e) {
				reject(e);
			}
		});

		reader.readAsArrayBuffer(file);
	});
};

export const getSupportedVideoFileExtensions = () => {
	const video = document.createElement('video');

	const canPlay = {
		mp4: video.canPlayType('video/mp4'),
		ogg: video.canPlayType('video/ogg'),
		webm: video.canPlayType('video/webm'),
		mov: video.canPlayType('video/mov'),
		avi: video.canPlayType('video/avi'),
	};

	const extensionList = [];

	for (let ext in canPlay) {
		if (canPlay[ext]) extensionList.push(`.${ext}`);
	}

	return extensionList;
};
