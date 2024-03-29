import {WebVTT} from 'vtt.js'
import {ExtendableError} from '../errors'

export class EmptyVTTFileError extends ExtendableError {
	constructor(m = 'Empty VTT file') {
		super(m)
		this.name = 'EmptyVTTFileError'
	}
}

export class MalformedVTTSignatureError extends ExtendableError {
	constructor(m = 'Malformed VTT Signature') {
		super(m)
		this.name = 'MalformedVTTSignatureError'
	}
}

export class MalformedVTTTimestampError extends ExtendableError {
	constructor(badTimeStamp, m = 'Malformed VTT timestamp') {
		super(`${m} - ${badTimeStamp}`)
		this.name = 'MalformedVTTTimestampError'
		this.badTimeStamp = badTimeStamp
	}
}

const CUE_STORAGE_KEY = 'vtt_creator_cues'

// http://bbc.github.io/subtitle-guidelines/
// ideally follow these guidelines:
// - 160-180 words per minute
// - 37 fixed-width (monospaced) characters per line OR 68% of the width of a 16:9 video and 90% of the width of a 4:3 video
// - break at natural points: http://bbc.github.io/subtitle-guidelines/#Break-at-natural-points

// type WordsList = Array<{
// 	startTime: string, // "10.500s"
// 	endTime: string, // "12.600s"
// 	word: string // the word itself
// }>;
export function getCuesFromWords(wordsList) {
	let cursor = 0
	const numWords = wordsList.length
	const cues = []

	while (cursor < numWords) {
		const [cue, wordCount] = getCueFromWords(wordsList, cursor)
		cues.push(cue)
		cursor += wordCount
	}

	return cues
}

function getCueFromWords(wordsList, cursor) {
	let charCount = 0
	const endOfList = wordsList.length
	const start = cursor
	// netflix style guide is 42 chars per line: https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-Timed-Text-Style-Guide
	//   start === cursor ensures we always move forward at least one word. I've never heard of a single 42 character long word...but its possible
	while (cursor < endOfList && (start === cursor || charCount + wordsList[cursor].word.length < 42)) {
		charCount += wordsList[cursor].word.length + 1 // plus 1 for the space after this word
		cursor++
	}

	return [
		new VTTCue(wordsList[start].startTime, wordsList[cursor - 1].endTime, joinWords(wordsList, start, cursor)),
		cursor - start,
	]
}

function joinWords(wordsList, from, to) {
	const numWordsToJoin = to - from
	// TODO: does using the Array constructor this way actually help with memory allocation?
	const wordsToJoin = new Array(numWordsToJoin)
	for (let i = 0; i < numWordsToJoin; i++) {
		wordsToJoin[i] = wordsList[from + i].word
	}
	return wordsToJoin.join(' ')
}

// type CueList = Array<VTTCue>;
export function getVTTFromCues(cueList, title = 'Made with VTT Creator') {
	const vttParts = cueList.map((nextCue) => {
		const start = formatSeconds(nextCue.startTime)
		const end = formatSeconds(nextCue.endTime)
		const settings = []
		if (nextCue.vertical) {
			settings.push(`vertical:${nextCue.vertical}`)
		}
		if (Number.isFinite(nextCue.position)) {
			settings.push(`position:${nextCue.position}%`)
		}
		if (nextCue.align) {
			settings.push(`align:${nextCue.align}`)
		}
		if (Number.isFinite(nextCue.line)) {
			settings.push(`line:${nextCue.line}%`)
		}
		return `${start} --> ${end} ${settings.join(' ')}\n${nextCue.text}\n\n`
	})

	vttParts.unshift(`WEBVTT - ${title}\n\n`)

	return new Blob(vttParts, {type: 'text/vtt;charset=utf8'})
}

// decSeconds is a float version of the time in seconds (e.g. 13.456)
export function formatSeconds(decSeconds) {
	if (isNaN(decSeconds)) return '00:00.000'
	const min = Math.floor(decSeconds / 60)
	const sec = Math.floor(decSeconds % 60)
	const mill = Math.round((decSeconds - Math.floor(decSeconds)) * 1000)
	return `${formatTimeUnit(min, 2)}:${formatTimeUnit(sec, 2)}.${formatTimeUnit(mill, 3)}`
}

function formatTimeUnit(unit, width) {
	if (!unit) return '0'.repeat(width)
	return unit.toString().padStart(width, '0')
}

export function getCuesFromVTT(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.addEventListener('error', () => {
			reader.abort()
			reject(new Error('An error occurred while reading the VTT file.'))
		})

		reader.addEventListener('load', async () => {
			if (!reader.result) return reject(new EmptyVTTFileError('Empty VTT file'))
			const cues = []
			const parser = new WebVTT.Parser(window, WebVTT.StringDecoder())
			parser.oncue = (c) => cues.push(c)
			parser.onparsingerror = (e) => {
				if (e.code === 0) return reject(new MalformedVTTSignatureError(e.message))
				if (e.code === 1) {
					// eslint-disable-next-line no-case-declarations
					const badTimeStamp = e.message.replace(/^Malformed timestamp:\s+/, '')
					return reject(new MalformedVTTTimestampError(badTimeStamp, e.message))
				}
				reject(new Error(e.message))
			}
			parser.onflush = () => resolve(cues)
			parser.parse(reader.result)
			parser.flush()
		})

		reader.readAsText(file)
	})
}

export function storeCues(cues) {
	const reducedCues = cues.map((c) => ({
		id: c.id,
		startTime: c.startTime,
		endTime: c.endTime,
		text: c.text,
		align: c.align,
		line: c.line,
		lineAlign: c.lineAlign,
		position: c.position,
		positionAlign: c.positionAlign,
		region: c.region,
		size: c.size,
		snapToLines: c.snapToLines,
		vertical: c.vertical,
	}))
	localStorage.setItem(CUE_STORAGE_KEY, JSON.stringify(reducedCues))
}

export function getCuesFromStorage() {
	const cueStr = localStorage.getItem(CUE_STORAGE_KEY)
	if (!cueStr) return null
	const parsed = JSON.parse(cueStr)
	return parsed.map((c) => {
		const cue = new VTTCue(c.startTime, c.endTime, c.text)
		cue.id = c.id
		if (c.align) cue.align = c.align
		if (c.line) cue.line = c.line
		if (c.lineAlign) cue.lineAlign = c.lineAlign
		if (c.position) cue.position = c.position
		if (c.positionAlign) cue.positionAlign = c.positionAlign
		if (c.region) cue.region = c.region
		if (c.size) cue.size = c.size
		if (c.snapToLines) cue.snapToLines = c.snapToLines
		if (c.vertical) cue.vertical = c.vertical
		return cue
	})
}
