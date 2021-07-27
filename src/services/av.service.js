const encodeWAV = require('audiobuffer-to-wav')

const SAMPLE_RATE = 44100
const AudioContext = window.AudioContext || window.webkitAudioContext
const OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext

export const getAudioBlobFromVideo = async file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.addEventListener('load', () => {
			new AudioContext({sampleRate: SAMPLE_RATE})
				.decodeAudioData(reader.result)
				.then(decodedBuffer => {
					return convertAudioBufferToMono(decodedBuffer)
				})
				.then(monoBuffer => {
					// use new Blob instead of new File for older edge compatibility: https://stackoverflow.com/a/43241922/2382483
					return new Blob([encodeWAV(monoBuffer)], {type: 'audio/wav'})
				})
				.then(resolve)
				// TODO: the resp object here appears to _be_ the error, despite the mdn example using resp.err. checking both for now...
				.catch(e => reject(e?.err || e || new Error('Unknown decoding error')))
		})

		reader.addEventListener('error', () => reject(reader.error))

		reader.readAsArrayBuffer(file)
	})
}

export async function convertAudioBufferToMono(buffer) {
	const offlineCtx = new OfflineAudioContext(1, buffer.length, SAMPLE_RATE)

	const soundSource = offlineCtx.createBufferSource()
	soundSource.buffer = buffer
	soundSource.connect(offlineCtx.destination)
	soundSource.start()

	return offlineCtx.startRendering()
}

export const getAudioBufferFromVideo = async file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.addEventListener('load', () => {
			new AudioContext({sampleRate: SAMPLE_RATE})
				.decodeAudioData(reader.result)
				.then(resolve)
				// TODO: the resp object here appears to _be_ the error, despite the mdn example using resp.err. checking both for now...
				.catch(e => reject(e?.err || e || new Error('Unknown decoding error')))
		})

		reader.addEventListener('error', () => reject(reader.error))

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
