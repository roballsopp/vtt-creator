import React from 'react'
import PropTypes from 'prop-types'
import sortBy from 'lodash/sortBy'
import {useToast} from './toast-context'
import {getCuesFromStorage, storeCues} from '../services/vtt.service'
import {handleError} from '../services/error-handler.service'
import {useVideoDom} from './video'

const CuesContext = React.createContext({
	cues: [],
	loading: true,
	addCue: () => {},
	removeCue: () => {},
	changeCueStart: () => {},
	changeCueEnd: () => {},
	changeCueText: () => {},
	changeCueTiming: () => {},
	setCues: () => {},
	setCuesLoading: () => {},
})

CuesProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function CuesProvider({children}) {
	const [cues, setCues] = React.useState([])
	const [loading, setLoading] = React.useState(true)
	const toast = useToast()
	const {videoRef} = useVideoDom()

	const saveCuesToStorage = React.useCallback(cues => {
		try {
			storeCues(cues)
		} catch (e) {
			handleError(e)
		}
	}, [])

	// load cues on mount
	React.useEffect(() => {
		try {
			const loadedCues = getCuesFromStorage()
			if (loadedCues) setCues(loadedCues)
		} catch (e) {
			handleError(e)
			toast.error('There was a problem loading the cues from your last session.')
		}
		setLoading(false)
	}, [toast])

	// save cues if we leave the site
	React.useEffect(() => {
		const handleBeforeUnload = () => {
			saveCuesToStorage(cues)
		}
		// this actually fires when the browser window is closing _and_ when a react router navigation happens
		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [cues, saveCuesToStorage])

	const addCue = React.useCallback(() => {
		setCues(cues => {
			const newCues = cues.slice()

			if (videoRef) {
				// if we have a video loaded, insert the new cue at the current video time
				const newCue = new VTTCue(videoRef.currentTime, videoRef.currentTime + 2, '')
				const newIndex = newCues.findIndex(c => c.startTime > newCue.startTime)
				if (newIndex === -1) {
					newCues.push(newCue)
				} else {
					newCues.splice(newIndex, 0, newCue)
				}
			} else if (cues.length) {
				// if we have some cues already, but no video, insert after the last cue
				const lastCue = cues[cues.length - 1]
				newCues.push(new VTTCue(lastCue.endTime, lastCue.endTime + 2, ''))
			} else {
				// if we're here, this is the only cue, and we have no video. just put it at the end
				newCues.push(new VTTCue(0, 2, ''))
			}

			return newCues
		})
	}, [videoRef])

	const removeCue = React.useCallback(id => {
		setCues(cues => {
			const newCues = cues.slice()
			const idx = newCues.findIndex(c => c.id === id)
			if (idx === -1) return handleError(new Error('removeCue: could not find cue in list'))
			newCues.splice(idx, 1)
			return newCues
		})
	}, [])

	const changeCueStart = React.useCallback((id, newStartTime) => {
		setCues(cues => {
			const newCues = cues.slice()
			const idx = newCues.findIndex(c => c.id === id)
			if (idx === -1) return handleError(new Error('changeCueStart: could not find cue in list'))
			const oldCue = cues[idx]
			newCues[idx] = new VTTCue(newStartTime, oldCue.endTime, oldCue.text, oldCue.id)
			return sortBy(newCues, ['startTime'])
		})
	}, [])

	const changeCueEnd = React.useCallback((id, newEndTime) => {
		setCues(cues => {
			const newCues = cues.slice()
			const idx = newCues.findIndex(c => c.id === id)
			if (idx === -1) return handleError(new Error('changeCueEnd: could not find cue in list'))
			const oldCue = cues[idx]
			newCues[idx] = new VTTCue(oldCue.startTime, newEndTime, oldCue.text, oldCue.id)
			return newCues
		})
	}, [])

	const changeCueText = React.useCallback((id, newText) => {
		setCues(cues => {
			const newCues = cues.slice()
			const idx = newCues.findIndex(c => c.id === id)
			if (idx === -1) return handleError(new Error('changeCueText: could not find cue in list'))
			const oldCue = cues[idx]
			newCues[idx] = new VTTCue(oldCue.startTime, oldCue.endTime, newText, oldCue.id)
			return newCues
		})
	}, [])

	const changeCueTiming = React.useCallback((id, {startDelta = 0, endDelta = 0}) => {
		setCues(cues => {
			const idx = cues.findIndex(c => c.id === id)
			if (idx === -1) return handleError(new Error('changeCueTiming: could not find cue in list'))

			const oldCue = cues[idx]

			let newStartTime = oldCue.startTime + startDelta
			let newEndTime = oldCue.endTime + endDelta

			if (newStartTime < 0 && endDelta) {
				newStartTime = 0
				newEndTime = oldCue.endTime - oldCue.startTime
			} else if (newStartTime < 0) {
				newStartTime = 0
			}

			const newCues = cues.slice()
			newCues[idx] = new VTTCue(newStartTime, newEndTime, oldCue.text, oldCue.id)

			return sortBy(newCues, ['startTime'])
		})
	}, [])

	return (
		<CuesContext.Provider
			value={React.useMemo(
				() => ({
					cues,
					loading,
					addCue,
					removeCue,
					changeCueStart,
					changeCueEnd,
					changeCueText,
					changeCueTiming,
					setCues,
					setCuesLoading: setLoading,
				}),
				[cues, loading, addCue, removeCue, changeCueStart, changeCueEnd, changeCueText, changeCueTiming]
			)}>
			{children}
		</CuesContext.Provider>
	)
}

export function useCues() {
	return React.useContext(CuesContext)
}
