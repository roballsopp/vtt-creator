import * as React from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import VoiceChatIcon from '@material-ui/icons/VoiceChat'
import {useVideoFile} from '../../common'
import {useExtractFromVideo} from './ExtractFromVideoContext'

ExtractFromVideoMenuItem.propTypes = {
	onOpening: PropTypes.func.isRequired,
	classes: PropTypes.shape({
		menuIcon: PropTypes.string,
	}).isRequired,
}

export default function ExtractFromVideoMenuItem({onOpening, classes}) {
	const {videoFile} = useVideoFile()
	const {handleCueExtractionDialogOpen, loading} = useExtractFromVideo()
	const [buttonEl, setButtonEl] = React.useState()

	const handleClick = e => {
		onOpening()
		handleCueExtractionDialogOpen(e)
	}

	if (!videoFile) {
		// span needed here because tooltips don't activate on disabled elements: https://material-ui.com/components/tooltips/#disabled-elements
		return (
			<Tooltip
				title="Select a video in the pane to the right to use this feature"
				placement="right"
				PopperProps={{anchorEl: buttonEl}}>
				<span>
					<MenuItem disabled ref={setButtonEl}>
						<VoiceChatIcon className={classes.menuIcon} />
						Extract from video...
					</MenuItem>
				</span>
			</Tooltip>
		)
	}

	if (loading) {
		return (
			<Tooltip title="Please wait..." placement="right" PopperProps={{anchorEl: buttonEl}}>
				<span>
					<MenuItem disabled ref={setButtonEl}>
						<VoiceChatIcon className={classes.menuIcon} />
						Extract from video...
					</MenuItem>
				</span>
			</Tooltip>
		)
	}

	return (
		<MenuItem onClick={handleClick}>
			<VoiceChatIcon className={classes.menuIcon} />
			Extract from video...
		</MenuItem>
	)
}
