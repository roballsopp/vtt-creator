import chai from 'chai'
import {
	getCuesFromWords,
	getVTTFromCues,
	getCuesFromVTT,
	EmptyVTTFileError,
	MalformedVTTTimestampError,
	MalformedVTTSignatureError,
} from './vtt.service'

const words = [
	{startTime: 0, endTime: 0.7, word: 'The'},
	{startTime: 0.7, endTime: 1.1, word: 'ABC'},
	{startTime: 1.1, endTime: 1.1, word: 'Company'},
	{startTime: 1.1, endTime: 1.8, word: 'code'},
	{startTime: 1.8, endTime: 1.8, word: 'of'},
	{startTime: 1.8, endTime: 2.4, word: 'conduct'},
	{startTime: 2.4, endTime: 2.8, word: 'is'},
	{startTime: 2.8, endTime: 2.9, word: 'an'},
	{startTime: 2.9, endTime: 3.4, word: 'important'},
	{startTime: 3.4, endTime: 3.7, word: 'tool'},
	{startTime: 3.7, endTime: 3.9, word: 'for'},
	{startTime: 3.9, endTime: 4.2, word: 'anyone'},
	{startTime: 4.2, endTime: 4.5, word: 'who'},
	{startTime: 4.5, endTime: 4.8, word: 'works'},
	{startTime: 4.8, endTime: 5, word: 'on'},
	{startTime: 5, endTime: 5.5, word: "ABC's"},
	{startTime: 5.5, endTime: 5.9, word: 'behalf.'},
	{startTime: 5.9, endTime: 7.4, word: 'So,'},
	{startTime: 7.4, endTime: 7.6, word: 'how'},
	{startTime: 7.6, endTime: 7.8, word: 'do'},
	{startTime: 7.8, endTime: 7.8, word: 'you'},
	{startTime: 7.8, endTime: 8.2, word: 'use'},
	{startTime: 8.2, endTime: 8.3, word: 'it'},
	{startTime: 8.3, endTime: 9.5, word: 'first'},
	{startTime: 9.5, endTime: 10, word: 'read'},
	{startTime: 10, endTime: 10, word: 'through'},
	{startTime: 10, endTime: 10.3, word: 'the'},
	{startTime: 10.3, endTime: 10.5, word: 'whole'},
	{startTime: 10.5, endTime: 10.9, word: 'document'},
	{startTime: 10.9, endTime: 11.2, word: 'to'},
	{startTime: 11.2, endTime: 11.4, word: 'make'},
	{startTime: 11.4, endTime: 11.6, word: 'sure'},
	{startTime: 11.6, endTime: 11.8, word: 'you'},
	{startTime: 11.8, endTime: 11.9, word: 'understand'},
	{startTime: 11.9, endTime: 12.5, word: 'it?'},
]

const VTTFile = `WEBVTT - Made with VTT Creator

00:00.000 --> 00:02.900 position:50% align:middle
The ABC Company code of conduct is an

00:02.900 --> 00:05.000 position:50% align:middle
important tool for anyone who works on

00:05.000 --> 00:09.500 position:50% align:middle
ABC's behalf. So, how do you use it first

00:09.500 --> 00:11.400 position:50% align:middle
read through the whole document to make

00:11.400 --> 00:12.500 position:50% align:middle
sure you understand it?`

const VTTFileWHours = `WEBVTT - Made with VTT Creator

00:00:00.000 --> 00:00:02.900
The ABC Company code of conduct is an

00:00:02.900 --> 00:00:05.000
important tool for anyone who works on

00:00:05.000 --> 00:00:09.500
ABC's behalf. So, how do you use it first

00:00:09.500 --> 00:00:11.400
read through the whole document to make

00:00:11.400 --> 00:00:12.500
sure you understand it?`

const cues = [
	new VTTCue(0, 2.9, 'The ABC Company code of conduct is an'),
	new VTTCue(2.9, 5, 'important tool for anyone who works on'),
	new VTTCue(5, 9.5, "ABC's behalf. So, how do you use it first"),
	new VTTCue(9.5, 11.4, 'read through the whole document to make'),
	new VTTCue(11.4, 12.5, 'sure you understand it?'),
]

describe('vtt.service', function () {
	describe('getCuesFromWords', function () {
		it('should output the correct cues', function () {
			const result = getCuesFromWords(words)
			cues.map((expectedCue, i) => {
				const actualCue = result[i]
				chai.assert.isOk(actualCue.id, `cue ${i} should have a unique id`)
				chai.assert.equal(actualCue.startTime, expectedCue.startTime, `startTimes for cue ${i} are not equal`)
				chai.assert.equal(actualCue.endTime, expectedCue.endTime, `endTimes for cue ${i} are not equal`)
				chai.assert.equal(actualCue.text, expectedCue.text, `text for cue ${i} is not equal`)
			})
		})
	})

	describe('getVTTFromCues', function () {
		it('should output the correct vtt file string', async () => {
			const vttBlob = getVTTFromCues(cues)
			const result = await readTextFile(vttBlob)
			chai.assert.strictEqual(result.trim(), VTTFile)
		})
	})

	describe('getCuesFromVTT', function () {
		describe('when timestamps have minutes in the most significant position', function () {
			before(async function () {
				const vttBlob = new Blob([VTTFile], {type: 'text/vtt'})
				this.result = await getCuesFromVTT(vttBlob)
			})

			it('outputs the correct cues', function () {
				cues.map((expectedCue, i) => {
					const actualCue = this.result[i]
					chai.assert.isOk(actualCue.id, `cue ${i} should have a unique id`)
					chai.assert.equal(actualCue.startTime, expectedCue.startTime, `startTimes for cue ${i} are not equal`)
					chai.assert.equal(actualCue.endTime, expectedCue.endTime, `endTimes for cue ${i} are not equal`)
					chai.assert.equal(actualCue.text, expectedCue.text, `text for cue ${i} is not equal`)
				})
			})
		})

		describe('when timestamps have hours in the most significant position', function () {
			before(async function () {
				const vttBlob = new Blob([VTTFileWHours], {type: 'text/vtt'})
				this.result = await getCuesFromVTT(vttBlob)
			})

			it('outputs the correct cues', function () {
				cues.map((expectedCue, i) => {
					const actualCue = this.result[i]
					chai.assert.isOk(actualCue.id, `cue ${i} should have a unique id`)
					chai.assert.equal(actualCue.startTime, expectedCue.startTime, `startTimes for cue ${i} are not equal`)
					chai.assert.equal(actualCue.endTime, expectedCue.endTime, `endTimes for cue ${i} are not equal`)
					chai.assert.equal(actualCue.text, expectedCue.text, `text for cue ${i} is not equal`)
				})
			})
		})

		describe('when the file is empty', function () {
			before(function () {
				this.vttBlob = new Blob([''], {type: 'text/vtt'})
			})

			it('throws an EmptyFileError', function (done) {
				getCuesFromVTT(this.vttBlob)
					.then(() => {
						done(new Error('Expected an error to be thrown'))
					})
					.catch((e) => {
						chai.expect(e).to.be.an.instanceof(EmptyVTTFileError)
						done()
					})
			})
		})

		describe('when the file has a malformed timestamp', function () {
			before(function () {
				const VTTFile = `WEBVTT - Made with VTT Creator

				00:00:00,000 --> 00:00:03.700
				The ABC Company code of conduct is an important tool`.replace('\t', '')

				this.vttBlob = new Blob([VTTFile], {type: 'text/vtt'})
			})

			it('throws a MalformedVTTTimestampError', function (done) {
				getCuesFromVTT(this.vttBlob)
					.then(() => {
						done(new Error('Expected an error to be thrown'))
					})
					.catch((e) => {
						chai.expect(e).to.be.an.instanceof(MalformedVTTTimestampError)
						chai.expect(e.badTimeStamp).to.equal('00:00:00,000 --> 00:00:03.700')
						done()
					})
			})
		})

		describe('when the file has a malformed header', function () {
			before(function () {
				const VTTFile = `WEBVT - Made with VTT Creator

				00:00:00.000 --> 00:00:03.700
				The ABC Company code of conduct is an important tool`.replace('\t', '')

				this.vttBlob = new Blob([VTTFile], {type: 'text/vtt'})
			})

			it('throws a MalformedVTTSignatureError', function (done) {
				getCuesFromVTT(this.vttBlob)
					.then(() => {
						done(new Error('Expected an error to be thrown'))
					})
					.catch((e) => {
						chai.expect(e).to.be.an.instanceof(MalformedVTTSignatureError)
						done()
					})
			})
		})
	})
})

function readTextFile(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.addEventListener('error', () => {
			reader.abort()
			reject(new Error('An error occurred while reading the file.'))
		})
		reader.addEventListener('load', () => {
			resolve(reader.result)
		})
		reader.readAsText(file)
	})
}
