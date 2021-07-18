import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/styles'
import {useFileSelector, useToast, useVideoFile, Button} from '../common'
import {Video as BaseVideo} from '../common/video'
import VideoOptionsMenu from './video-options-menu.component'
import VttTrack from './vtt-track.component'
import {getSupportedVideoFileExtensions} from '../services/av.service'

const ACCEPT = getSupportedVideoFileExtensions().join(',')

const useStyles = makeStyles(theme => ({
	loaderRoot: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
		color: 'white',
	},
	actionGutter: {
		marginBottom: theme.spacing(4),
	},
}))

Video.propTypes = {
	className: PropTypes.any,
}

export default function Video({className}) {
	const [src, setSrc] = React.useState()
	const classes = useStyles()
	const toast = useToast()
	const {onVideoFile} = useVideoFile()

	const onFilesSelected = React.useCallback(
		e => {
			const [file] = e.target.files
			onVideoFile(file)
			if (src) URL.revokeObjectURL(src)
			const localUrl = URL.createObjectURL(file)
			setSrc(localUrl)
		},
		[src, onVideoFile]
	)

	const onFileSizeExceeded = React.useCallback(() => {
		toast.error('The file you have selected is too large.')
	}, [toast])

	const openFileSelector = useFileSelector({accept: ACCEPT, onFilesSelected, onFileSizeExceeded})

	if (!src) {
		return (
			<div className={className}>
				<div className={classes.loaderRoot}>
					<Typography align="center" className={classes.actionGutter}>
						Choose a video from your computer to create or edit captions for:
					</Typography>
					<Button name="Initial Select Video" variant="contained" color="secondary" onClick={openFileSelector}>
						Select Video File
					</Button>
				</div>
			</div>
		)
	}

	return (
		<BaseVideo src={src} className={className} topElement={<VideoOptionsMenu onFilesSelected={onFilesSelected} />}>
			<VttTrack />
		</BaseVideo>
	)
}
