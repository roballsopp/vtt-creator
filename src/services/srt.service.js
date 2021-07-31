import {ExtendableError} from '../errors'

export class EmptySRTFileError extends ExtendableError {
	constructor(m = 'Empty SRT file') {
		super(m)
		this.name = 'EmptySRTFileError'
	}
}

export class MalformedSRTTimestampError extends ExtendableError {
	constructor(badTimeStamp, m = 'Malformed SRT timestamp') {
		super(`${m} - ${badTimeStamp}`)
		this.name = 'MalformedSRTTimestampError'
		this.badTimeStamp = badTimeStamp
	}
}

export function getSRTFromCues(cueList) {
	const srtParts = cueList.map((nextCue, i) => {
		const start = formatSeconds(nextCue.startTime)
		const end = formatSeconds(nextCue.endTime)
		return `${i + 1}\n${start} --> ${end}\n${nextCue.text}\n\n`
	})

	return new Blob(srtParts, {type: 'text/srt'})
}

// decSeconds is a float version of the time in seconds (e.g. 13.456)
export function formatSeconds(decSeconds) {
	if (isNaN(decSeconds)) return '00:00:00,000'
	const hrs = Math.floor(decSeconds / 3600)
	const min = Math.floor((decSeconds % 3600) / 60)
	const sec = Math.floor(decSeconds % 60)
	const mill = Math.round((decSeconds - Math.floor(decSeconds)) * 1000)
	return `${formatTimeUnit(hrs, 2)}:${formatTimeUnit(min, 2)}:${formatTimeUnit(sec, 2)},${formatTimeUnit(mill, 3)}`
}

function parseTimestamp(timestamp) {
	if (!timestamp) throw new MalformedSRTTimestampError(timestamp)

	const [hStr, mStr, smStr] = timestamp.split(':')
	if (!hStr || !mStr || !smStr) throw new MalformedSRTTimestampError(timestamp)

	const [sStr, milliStr] = smStr.split(',')
	if (!sStr || !milliStr) throw new MalformedSRTTimestampError(timestamp)

	const hours = Number(hStr)
	const minutes = Number(mStr)
	const seconds = Number(sStr)
	const millis = Number(milliStr)

	return hours * 60 * 60 + minutes * 60 + seconds + millis / 1000
}

function formatTimeUnit(unit, width) {
	if (!unit) return '0'.repeat(width)
	return unit.toString().padStart(width, '0')
}

export function getCuesFromSRT(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.addEventListener('error', () => {
			reader.abort()
			reject(new Error('An error occurred while reading the SRT file.'))
		})

		reader.addEventListener('load', async () => {
			if (!reader.result) return reject(new EmptySRTFileError('Empty SRT file'))
			const cues = []

			try {
				const lines = reader.result.split('\n')
				let l = 0

				while (l < lines.length) {
					if (!lines[l] || !Number.isFinite(Number(lines[l]))) {
						l++
						continue
					}

					const timestamps = lines[++l]
					let [start, end] = timestamps.split('-->')
					start = start?.trim()
					end = end?.trim()
					if (!start || !end) throw new MalformedSRTTimestampError(timestamps)

					const text = []
					while ((lines[++l] || '').trim()) {
						text.push(lines[l])
					}

					cues.push(new VTTCue(parseTimestamp(start), parseTimestamp(end), text.join('\n')))
					l++
				}
			} catch (e) {
				return reject(e)
			}

			resolve(cues)
		})

		reader.readAsText(file)
	})
}
