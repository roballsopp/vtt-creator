import 'regenerator-runtime/runtime';
import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/es/promise';
import 'core-js/es/object';
import { VTTCue as BaseCue } from 'vtt.js';
import { v4 as uuid } from 'uuid';

class VTTCue extends BaseCue {
	constructor(startTime, endTime, text, id) {
		super(startTime, endTime, text);
		this.id = id || uuid();
	}
}

window.VTTCue = VTTCue;
