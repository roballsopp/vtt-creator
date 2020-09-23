import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import VoiceChatIcon from '@material-ui/icons/VoiceChat';
import { useVideoFile } from '../../common';
import { useExtractFromVideo } from './ExtractFromVideoContext';

export default function ExtractFromVideoButton({ classes }) {
	const { videoFile } = useVideoFile();
	const { handleCueExtractionDialogOpen } = useExtractFromVideo();
	const [buttonEl, setButtonEl] = React.useState();

	if (!videoFile) {
		// span needed here because tooltips don't activate on disabled elements: https://material-ui.com/components/tooltips/#disabled-elements
		return (
			<Tooltip
				title="Select a video in the pane to the right to use this feature"
				placement="right"
				PopperProps={{ anchorEl: buttonEl }}>
				<span>
					<MenuItem disabled ref={setButtonEl}>
						<VoiceChatIcon className={classes.menuIcon} />
						Extract from video...
					</MenuItem>
				</span>
			</Tooltip>
		);
	}

	return (
		<MenuItem onClick={handleCueExtractionDialogOpen}>
			<VoiceChatIcon className={classes.menuIcon} />
			Extract from video...
		</MenuItem>
	);
}
