import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import {useDragging} from '../../common'
import {useCueTrack} from '../cue-track-context'
import {useZoom} from '../zoom-container.component'

const useStyles = makeStyles({
	root: {
		opacity: 0,
		'&:hover': {
			opacity: 0.05,
		},
		touchAction: 'none',
	},
})

CueHandleCenter.propTypes = {
	cueId: PropTypes.string.isRequired,
	onDragging: PropTypes.func.isRequired,
	onChangeCueTiming: PropTypes.func.isRequired,
	className: PropTypes.string,
}

function CueHandleCenter({cueId, onDragging, onChangeCueTiming, className}) {
	const classes = useStyles()
	const [handleRef, setHandleRef] = React.useState()
	const startPosRef = React.useRef(0)
	const prevPosRef = React.useRef(0)
	const didDragRef = React.useRef(false)
	const {pixelsPerSec} = useZoom()
	const {trackEl} = useCueTrack()

	useDragging(handleRef, {
		onDragStart: React.useCallback(
			e => {
				// we use client bounding box to get relative position to the track element so that scrolling while sliding works as expected
				const bbox = trackEl.getBoundingClientRect()
				const relPos = e.clientX - bbox.left
				startPosRef.current = relPos
				prevPosRef.current = relPos
				didDragRef.current = false
			},
			[trackEl]
		),
		onDragging: React.useCallback(
			e => {
				const bbox = trackEl.getBoundingClientRect()
				const relPos = e.clientX - bbox.left
				onDragging(relPos - prevPosRef.current)
				prevPosRef.current = relPos
				didDragRef.current = true
			},
			[onDragging, trackEl]
		),
		onDragEnd: React.useCallback(
			e => {
				const bbox = trackEl.getBoundingClientRect()
				const relPos = e.clientX - bbox.left
				const d = (relPos - startPosRef.current) / pixelsPerSec
				onChangeCueTiming(cueId, {startDelta: d, endDelta: d})
			},
			[trackEl, cueId, pixelsPerSec, onChangeCueTiming]
		),
	})

	const handleClick = e => {
		// if we performed a drag, don't fire the click event
		if (didDragRef.current) e.stopPropagation()
	}

	return <div ref={setHandleRef} className={clsx(classes.root, className)} onClick={handleClick} />
}

export default React.memo(CueHandleCenter)
