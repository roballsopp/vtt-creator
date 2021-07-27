import * as React from 'react'
import throttle from 'lodash/throttle'
import muiPinks from '@material-ui/core/colors/pink'
import {makeStyles} from '@material-ui/styles'
import {useVideoFile} from '../common'
import {useZoom} from './zoom-container.component'
import {getAudioBufferFromVideo} from '../services/av.service'
import {handleError} from '../services/error-handler.service'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		height: '100%',
		justifyContent: 'center',
		flexDirection: 'column',
	},
	canvas: {
		width: '100%',
		height: '100%',
	},
})

export default function AudioTrack() {
	const classes = useStyles()

	const {videoFile} = useVideoFile()
	const {pixelsPerSec, zoomEvents} = useZoom()

	const canvasRef = React.useRef()
	const audioBufferRef = React.useRef()
	const peakCacheRef = React.useRef()
	const scrollRef = React.useRef(0)
	const pixPerSecRef = React.useRef(pixelsPerSec)

	const setCanvasBounds = React.useCallback(() => {
		if (!canvasRef.current) return
		// we have to do this because the canvas's internal width and height are only set by the width and height attributes
		//   added to the canvas element, which must be hard pixel values. since we need dynamic, we have to check the actual
		//   width and height of the element each time the height and width change
		const {width, height} = canvasRef.current.getBoundingClientRect()
		canvasRef.current.width = width
		canvasRef.current.height = height
	}, [])

	const draw = React.useCallback(() => {
		if (!audioBufferRef.current || !canvasRef.current) return

		const {width, height} = canvasRef.current

		const sampPerPix = audioBufferRef.current.sampleRate / pixPerSecRef.current

		const ctx = canvasRef.current.getContext('2d')
		ctx.strokeStyle = muiPinks[300]

		const getPeaks = peakCacheRef.current

		let sample = scrollRef.current * sampPerPix
		ctx.clearRect(0, 0, width, height)
		ctx.beginPath()
		for (let i = 0; i < width; i++) {
			const [min, max] = getPeaks(Math.round(sample), Math.round(sample + sampPerPix))
			// rounding to whole pixels avoids having the browser do anti-aliasing calculations
			ctx.moveTo(i, Math.round(((min + 1) / 2) * height))
			ctx.lineTo(i, Math.round(((max + 1) / 2) * height))
			sample += sampPerPix
		}
		ctx.stroke()
	}, [])

	const throttledDraw = React.useMemo(() => throttle(draw, 20), [draw])

	React.useEffect(() => {
		if (!videoFile) return

		audioBufferRef.current = null
		peakCacheRef.current = null
		const ctx = canvasRef.current.getContext('2d')
		ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

		getAudioBufferFromVideo(videoFile)
			.then(buff => {
				audioBufferRef.current = buff
				peakCacheRef.current = createPeakCache(buff)
				draw()
			})
			.catch(err => {
				handleError(err)
			})
	}, [draw, videoFile])

	React.useEffect(() => setCanvasBounds(), [setCanvasBounds])

	React.useEffect(() => {
		const handleResize = () => {
			setCanvasBounds()
			throttledDraw()
		}
		const handleScroll = e => {
			scrollRef.current = e.target.scrollLeft
			throttledDraw()
		}
		window.addEventListener('resize', handleResize)
		zoomEvents.on('scroll', handleScroll)
		return () => {
			window.removeEventListener('resize', handleResize)
			zoomEvents.off('scroll', handleScroll)
		}
	}, [zoomEvents, setCanvasBounds, throttledDraw])

	React.useEffect(() => {
		pixPerSecRef.current = pixelsPerSec
		draw()
	}, [draw, pixelsPerSec])

	return <canvas ref={canvasRef} className={classes.canvas} />
}

function createPeakCache(buffer) {
	const cache = {}

	return function getPeaks(start, end) {
		const cacheName = `${start}_${end}`

		if (cache[cacheName]) return cache[cacheName]

		let min = 0
		let max = 0

		for (let c = 0; c < buffer.numberOfChannels; c++) {
			const samples = buffer.getChannelData(c)
			for (let i = start; i < end; i++) {
				if (samples[i] < min) min = samples[i]
				if (samples[i] > max) max = samples[i]
			}
		}

		return (cache[cacheName] = [min, max])
	}
}
