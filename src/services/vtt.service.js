import * as PropTypes from 'prop-types';
import { WebVTT } from 'vtt.js';

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
	let cursor = 0;
	const numWords = wordsList.length;
	const cues = [];

	while (cursor < numWords) {
		const [cue, wordCount] = getCueFromWords(wordsList, cursor);
		cues.push(cue);
		cursor += wordCount;
	}

	return cues;
}

function getCueFromWords(wordsList, cursor) {
	let charCount = 0;
	const endOfList = wordsList.length;
	const start = cursor;
	while (charCount < 40 && cursor < endOfList) {
		const wordData = wordsList[cursor];
		charCount += wordData.word.length;
		cursor++;
	}

	return [
		{
			startTime: parseGoogleTime(wordsList[start].startTime),
			endTime: parseGoogleTime(wordsList[cursor - 1].endTime),
			text: joinWords(wordsList, start, cursor),
		},
		cursor - start,
	];
}

function joinWords(wordsList, from, to) {
	const numWordsToJoin = to - from;
	// TODO: does using the Array constructor this way actually help with memory allocation?
	const wordsToJoin = new Array(numWordsToJoin);
	for (let i = 0; i < numWordsToJoin; i++) {
		wordsToJoin[i] = wordsList[from + i].word;
	}
	return wordsToJoin.join(' ');
}

export const CuePropType = PropTypes.instanceOf(VTTCue);

// type CueList = Array<VTTCue>;
export function getVTTFromCues(cueList, title = 'Some title') {
	const vttParts = cueList.map(nextCue => {
		const start = formatSeconds(nextCue.startTime);
		const end = formatSeconds(nextCue.endTime);
		return `${start} --> ${end}\n${nextCue.text}\n\n`;
	});

	vttParts.unshift(`WEBVTT - ${title}\n\n`);

	return new Blob(vttParts, { type: 'text/vtt' });
}

// decSeconds is a float version of the time in seconds (e.g. 13.456)
export function formatSeconds(decSeconds) {
	if (isNaN(decSeconds)) return '00:00:000';
	const min = Math.floor(decSeconds / 60);
	const sec = Math.floor(decSeconds % 60);
	const mill = Math.round((decSeconds - Math.floor(decSeconds)) * 1000);
	return `${formatTimeUnit(min, 2)}:${formatTimeUnit(sec, 2)}.${formatTimeUnit(mill, 3)}`;
}

function formatTimeUnit(unit, width) {
	if (!unit) return '0'.repeat(width);
	return unit.toString().padStart(width, '0');
}

export function parseVTTTime(formattedTime) {
	const [min10, min1, sep1, sec10, sec1, sep2, mill10, mill100, mill1000] = formattedTime.split(''); // eslint-disable-line no-unused-vars

	return (
		parseTimeUnit(min10) * 10 * 60 +
		parseTimeUnit(min1) * 60 +
		parseTimeUnit(sec10) * 10 +
		parseTimeUnit(sec1) +
		parseTimeUnit(mill10) / 10 +
		parseTimeUnit(mill100) / 100 +
		parseTimeUnit(mill1000) / 1000
	);
}

function parseTimeUnit(unit) {
	const parsed = parseInt(unit);
	return isNaN(parsed) ? 0 : parsed;
}

// timeString is a string in the format "10.500s"
function parseGoogleTime(timeString) {
	return parseFloat(timeString.slice(0, -1));
}

export function getCuesFromVTT(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.addEventListener('error', () => {
			reader.abort();
			reject(new Error('An error occurred while reading the file.'));
		});

		reader.addEventListener('load', async () => {
			if (!reader.result) return reject(new Error('Empty VTT file'));
			const cues = [];
			const parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
			parser.oncue = c => cues.push(c);
			parser.onparsingerror = e => reject(new Error(e.message));
			parser.onflush = () => resolve(cues);
			parser.parse(reader.result);
			parser.flush();
		});

		reader.readAsText(file);
	});
}
