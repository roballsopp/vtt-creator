import * as React from 'react'
import * as WaveSurfer from 'wavesurfer.js'
import muiPinks from '@material-ui/core/colors/pink'
import {makeStyles} from '@material-ui/styles'
import {useVideoFile} from '../common'
import {useZoom} from './zoom-container.component'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		height: '100%',
		justifyContent: 'center',
		flexDirection: 'column',
	},
})

export default function AudioTrack() {
	const [waveformRef, setWaveformRef] = React.useState()
	const [wavesurfer, setWavesurfer] = React.useState()
	const {videoFile} = useVideoFile()
	const {pixelsPerSec} = useZoom()
	const classes = useStyles()

	React.useEffect(() => {
		if (!waveformRef) return

		const surfer = WaveSurfer.create({
			container: waveformRef,
			waveColor: muiPinks[400],
			interact: false,
			cursorWidth: 0,
			fillParent: false,
			minPxPerSec: 200,
		})

		setWavesurfer(surfer)

		return () => {
			surfer.destroy()
		}
	}, [waveformRef])

	React.useEffect(() => {
		if (videoFile && wavesurfer) wavesurfer.loadBlob(videoFile)
	}, [videoFile, wavesurfer])

	React.useEffect(() => {
		if (wavesurfer) wavesurfer.zoom(pixelsPerSec)
	}, [pixelsPerSec, wavesurfer])

	return <div ref={setWaveformRef} className={classes.root} />
}
