import * as React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import {useVideoFile, Button} from '../../common'
import {useExtractFromVideo} from './ExtractFromVideoContext'

export default function ExtractFromVideoButton(buttonProps) {
	const {videoFile} = useVideoFile()
	const {loading, handleCueExtractionDialogOpen} = useExtractFromVideo()

	if (!videoFile) {
		// span needed here because tooltips don't activate on disabled elements: https://material-ui.com/components/tooltips/#disabled-elements
		return (
			<Tooltip title="Select a video in the pane to the right to use this feature" placement="bottom">
				<div>
					<Button {...buttonProps} disabled>
						Extract from video
					</Button>
				</div>
			</Tooltip>
		)
	}

	return (
		<Button {...buttonProps} loading={loading} onClick={handleCueExtractionDialogOpen}>
			Extract from video
		</Button>
	)
}
