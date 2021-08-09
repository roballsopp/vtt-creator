import React from 'react'
import PropTypes from 'prop-types'
import {Box, Typography, useMediaQuery} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Button, useVideoFile} from '../common'
import {Video as BaseVideo} from '../common/video'
import SelectVideoButton from '../common/SelectVideoButton'
import VideoOptionsMenu from './video-options-menu.component'
import VttTrack from './vtt-track.component'
import {VC as VCIcon} from '../common/icons'
import VttMenu from '../editor/vtt-menu.component'

const useStyles = makeStyles(theme => ({
	actionGutter: {
		marginBottom: theme.spacing(4),
	},
}))

Video.propTypes = {
	className: PropTypes.any,
}

export default function Video({className}) {
	const classes = useStyles()
	const {videoFile} = useVideoFile()
	const useMobileLayout = useMediaQuery(theme => theme.breakpoints.down('sm'))

	if (!videoFile && useMobileLayout) {
		return (
			<div className={className}>
				<Box width="100%" height="100%" display="flex" flexDirection="column" bgcolor="black" color="white" px={2}>
					<Box display="flex" alignItems="center">
						<VCIcon fontSize="large" edge="start" style={{marginRight: 8}} />
						<Typography variant="h6" color="inherit" style={{flexGrow: 1}}>
							VTT Creator
						</Typography>
						<VttMenu />
					</Box>
					<Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
						<Typography align="center" className={classes.actionGutter}>
							Choose a video from your computer to create or edit captions for:
						</Typography>
						<SelectVideoButton
							element={
								<Button name="Initial Select Video" variant="contained" color="secondary">
									Select Video File
								</Button>
							}
						/>
					</Box>
				</Box>
			</div>
		)
	}

	if (!videoFile) {
		return (
			<div className={className}>
				<Box
					width="100%"
					height="100%"
					flex={1}
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					bgcolor="black"
					color="white">
					<Typography align="center" className={classes.actionGutter}>
						Choose a video from your computer to create or edit captions for:
					</Typography>
					<SelectVideoButton
						element={
							<Button name="Initial Select Video" variant="contained" color="secondary">
								Select Video File
							</Button>
						}
					/>
				</Box>
			</div>
		)
	}

	return (
		<BaseVideo
			className={className}
			topElement={
				useMobileLayout ? (
					<Box px={2}>
						<VttMenu />
					</Box>
				) : (
					<VideoOptionsMenu />
				)
			}>
			<VttTrack />
		</BaseVideo>
	)
}
