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
