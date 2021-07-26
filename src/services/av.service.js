const encodeWAV = require('audiobuffer-to-wav')

const SAMPLE_RATE = 44100
const AudioContext = window.AudioContext || window.webkitAudioContext
const OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext

export const getAudioBlobFromVideo = async file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.addEventListener('load', () => {
			const decodeCtx = new AudioContext({sampleRate: SAMPLE_RATE})
			// using callback style for safari compatibility
			decodeCtx.decodeAudioData(
				reader.result,
				decodedBuffer => {
					// TODO: all this garbage just to convert to mono...i think...improvements?
					const offlineCtx = new OfflineAudioContext(1, decodedBuffer.length, SAMPLE_RATE)
					const soundSource = offlineCtx.createBufferSource()

					soundSource.buffer = decodedBuffer
					soundSource.connect(offlineCtx.destination)
					soundSource.start()

					// using event style for safari compatibility
					offlineCtx.addEventListener('complete', e => {
						// use new Blob instead of new File for older edge compatibility: https://stackoverflow.com/a/43241922/2382483
						resolve(new Blob([encodeWAV(e.renderedBuffer)], {type: 'audio/wav'}))
					})

					offlineCtx.startRendering()
				},
				// TODO: the resp object here appears to _be_ the error, despite the mdn example using resp.err. checking both for now...
				resp => reject(resp.err || resp)
			)
		})

		reader.readAsArrayBuffer(file)
	})
}

export const getAudioBufferFromVideo = async file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.addEventListener('load', () => {
			const decodeCtx = new AudioContext({sampleRate: SAMPLE_RATE})
			// using callback style for safari compatibility
			decodeCtx.decodeAudioData(
				reader.result,
				buf => resolve(buf),
				// TODO: the resp object here appears to _be_ the error, despite the mdn example using resp.err. checking both for now...
				resp => reject(resp.err || resp)
			)
		})

		reader.readAsArrayBuffer(file)
	})
}

export const getSupportedVideoFileExtensions = () => {
	const video = document.createElement('video')

	const canPlay = {
		mp4: video.canPlayType('video/mp4'),
		ogg: video.canPlayType('video/ogg'),
		webm: video.canPlayType('video/webm'),
		mov: video.canPlayType('video/mov'),
		avi: video.canPlayType('video/avi'),
	}

	const extensionList = []

	for (let ext in canPlay) {
		if (canPlay[ext]) extensionList.push(`.${ext}`)
	}

	return extensionList
}
