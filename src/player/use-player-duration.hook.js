import * as React from 'react'
import {useDuration} from '../common/video'
import {useCues} from '../common'

export default function usePlayerDuration() {
	const {duration} = useDuration()
	// TODO: this will cause a re-render on every cue change, but we really only need to re-render when the endTime of the last cue changes
	const cueDuration = useCueDuration()

	return React.useMemo(() => ({duration: duration || cueDuration}), [duration, cueDuration])
}

function useCueDuration() {
	const {cues} = useCues()
	if (cues && cues.length) {
		return cues[cues.length - 1].endTime
	}
}
