import * as React from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import CaptionsIcon from '@material-ui/icons/ClosedCaption'
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
		window.gtag('event', 'extract from video menu item', {
			event_category: 'button_click',
		})
		onOpening()
		handleCueExtractionDialogOpen(e)
	}

	const tooltipText = getTooltipText(loading, videoFile)

	if (tooltipText) {
		// span needed here because tooltips don't activate on disabled elements: https://material-ui.com/components/tooltips/#disabled-elements
		return (
			<Tooltip title={tooltipText} placement="left" PopperProps={{anchorEl: buttonEl}}>
				<span>
					<MenuItem disabled ref={setButtonEl}>
						<CaptionsIcon className={classes.menuIcon} />
						Extract from video...
					</MenuItem>
				</span>
			</Tooltip>
		)
	}

	return (
		<MenuItem onClick={handleClick}>
			<CaptionsIcon className={classes.menuIcon} />
			Extract from video...
		</MenuItem>
	)
}

function getTooltipText(loading, videoFile) {
	if (loading) return 'Please wait...'
	if (!videoFile) return 'Select a video in the pane to the left to use this feature.'
}
