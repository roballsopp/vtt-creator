import React from 'react'
import PropTypes from 'prop-types'
import {useVideoControl} from '../common/video'
import {useZoom} from './zoom-container.component'

const CueTrackContext = React.createContext({
	trackEl: null,
})

CueTrackProvider.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.any,
}

export function CueTrackProvider({children, className}) {
	const [trackEl, setTrackEl] = React.useState()
	const {seekVideo} = useVideoControl()
	const {pixelsPerSec} = useZoom()

	// navigate video when user clicks on a location in the track
	const handleTrackClick = e => {
		const bbox = trackEl.getBoundingClientRect()
		seekVideo((e.clientX - bbox.left) / pixelsPerSec)
	}

	return (
		<CueTrackContext.Provider value={React.useMemo(() => ({trackEl}), [trackEl])}>
			<div ref={setTrackEl} className={className} onClick={handleTrackClick}>
				{children}
			</div>
		</CueTrackContext.Provider>
	)
}

export function useCueTrack() {
	return React.useContext(CueTrackContext)
}
