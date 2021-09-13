import 'regenerator-runtime/runtime'
import {VTTCue as BaseCue} from 'vtt.js'
import {v4 as uuid} from 'uuid'

class VTTCue extends BaseCue {
	constructor(startTime, endTime, text, id) {
		super(startTime, endTime, text)
		this.id = id || uuid()
	}
}

window.VTTCue = VTTCue
