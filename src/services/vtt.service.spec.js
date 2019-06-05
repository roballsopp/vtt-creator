import chai from 'chai';
import { getCuesFromWords, getVTTFromCues } from './vtt.service';

const words = [
	{ startTime: '0s', endTime: '0.700s', word: 'The' },
	{ startTime: '0.700s', endTime: '1.100s', word: 'Volvo' },
	{ startTime: '1.100s', endTime: '1.100s', word: 'group' },
	{ startTime: '1.100s', endTime: '1.800s', word: 'code' },
	{ startTime: '1.800s', endTime: '1.800s', word: 'of' },
	{ startTime: '1.800s', endTime: '2.400s', word: 'conduct' },
	{ startTime: '2.400s', endTime: '2.800s', word: 'is' },
	{ startTime: '2.800s', endTime: '2.900s', word: 'an' },
	{ startTime: '2.900s', endTime: '3.400s', word: 'important' },
	{ startTime: '3.400s', endTime: '3.700s', word: 'tool' },
	{ startTime: '3.700s', endTime: '3.900s', word: 'for' },
	{ startTime: '3.900s', endTime: '4.200s', word: 'anyone' },
	{ startTime: '4.200s', endTime: '4.500s', word: 'who' },
	{ startTime: '4.500s', endTime: '4.800s', word: 'works' },
	{ startTime: '4.800s', endTime: '5s', word: 'on' },
	{ startTime: '5s', endTime: '5.500s', word: "Volvo's" },
	{ startTime: '5.500s', endTime: '5.900s', word: 'behalf.' },
	{ startTime: '5.900s', endTime: '7.400s', word: 'So,' },
	{ startTime: '7.400s', endTime: '7.600s', word: 'how' },
	{ startTime: '7.600s', endTime: '7.800s', word: 'do' },
	{ startTime: '7.800s', endTime: '7.800s', word: 'you' },
	{ startTime: '7.800s', endTime: '8.200s', word: 'use' },
	{ startTime: '8.200s', endTime: '8.300s', word: 'it' },
	{ startTime: '8.300s', endTime: '9.500s', word: 'first' },
	{ startTime: '9.500s', endTime: '10s', word: 'read' },
	{ startTime: '10s', endTime: '10s', word: 'through' },
	{ startTime: '10s', endTime: '10.300s', word: 'the' },
	{ startTime: '10.300s', endTime: '10.500s', word: 'whole' },
	{ startTime: '10.500s', endTime: '10.900s', word: 'document' },
	{ startTime: '10.900s', endTime: '11.200s', word: 'to' },
	{ startTime: '11.200s', endTime: '11.400s', word: 'make' },
	{ startTime: '11.400s', endTime: '11.600s', word: 'sure' },
	{ startTime: '11.600s', endTime: '11.800s', word: 'you' },
	{ startTime: '11.800s', endTime: '11.900s', word: 'understand' },
	{ startTime: '11.900s', endTime: '12.500s', word: 'it?' },
];

const VTTFile = `WEBVTT - Some title

00:00.000 --> 00:03.700
The Volvo group code of conduct is an important tool

00:03.700 --> 00:07.800
for anyone who works on Volvo's behalf. So, how do

00:07.800 --> 00:10.900
you use it first read through the whole document

00:10.900 --> 00:12.500
to make sure you understand it?`;

const cues = [
	{ startTime: 0, endTime: 3.7, text: 'The Volvo group code of conduct is an important tool' },
	{ startTime: 3.7, endTime: 7.8, text: "for anyone who works on Volvo's behalf. So, how do" },
	{ startTime: 7.8, endTime: 10.9, text: 'you use it first read through the whole document' },
	{ startTime: 10.9, endTime: 12.5, text: 'to make sure you understand it?' },
];

describe('vtt.service', function() {
	describe('getCuesFromWords', function() {
		it('should output the correct cues', function() {
			const result = getCuesFromWords(words);
			chai.assert.deepEqual(result, cues);
		});
	});

	describe('getVTTFromCues', function() {
		it('should output the correct vtt file string', function(done) {
			const vttBlob = getVTTFromCues(cues);
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				chai.assert.equal(reader.result.trim(), VTTFile);
				done();
			});
			reader.readAsText(vttBlob);
		});
	});
});
