import 'regenerator-runtime/runtime'
import {VTTCue as BaseCue} from 'vtt.js'
import {v4 as uuid} from 'uuid'

class VTTCue extends BaseCue {
	constructor(startTime, endTime, text, existingCue) {
		super(startTime, endTime, text)
		this.id = uuid()
		if (existingCue) {
			this.id = existingCue.id
			this.align = existingCue.align
			this.line = existingCue.line
			this.lineAlign = existingCue.lineAlign
			this.position = existingCue.position
			this.positionAlign = existingCue.positionAlign
			this.region = existingCue.region
			this.size = existingCue.size
			this.snapToLines = existingCue.snapToLines
			this.vertical = existingCue.vertical
		}
	}
}

window.VTTCue = VTTCue
