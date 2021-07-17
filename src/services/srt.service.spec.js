import chai from 'chai'
import {getSRTFromCues} from './srt.service'

const SRTFile = `1
00:00:00,000 --> 00:00:03,700
The Volvo group code of conduct is an important tool

2
00:00:03,700 --> 00:00:07,800
for anyone who works on Volvo's behalf. So, how do

3
00:00:07,800 --> 00:00:10,900
you use it first read through the whole document

4
00:00:10,900 --> 00:00:12,500
to make sure you understand it?`

const cues = [
	new VTTCue(0, 3.7, 'The Volvo group code of conduct is an important tool'),
	new VTTCue(3.7, 7.8, "for anyone who works on Volvo's behalf. So, how do"),
	new VTTCue(7.8, 10.9, 'you use it first read through the whole document'),
	new VTTCue(10.9, 12.5, 'to make sure you understand it?'),
]

describe('srt.service', function() {
	describe('getSRTFromCues', function() {
		it('should output the correct srt file string', async () => {
			const srtBlob = getSRTFromCues(cues)
			const result = await readTextFile(srtBlob)
			chai.assert.strictEqual(result.trim(), SRTFile)
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
