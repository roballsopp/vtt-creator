import * as React from 'react'
import * as PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'

export const UPLOAD_STATE_EXTRACTING = 'extracting'
export const UPLOAD_STATE_UPLOADING = 'uploading'
export const UPLOAD_STATE_PROCESSING = 'processing'
export const UPLOAD_STATE_COMPLETED = 'completed'
export const UPLOAD_STATE_FAILED = 'failed'

const UploadStatePropType = PropTypes.oneOf([
	UPLOAD_STATE_EXTRACTING,
	UPLOAD_STATE_UPLOADING,
	UPLOAD_STATE_PROCESSING,
	UPLOAD_STATE_COMPLETED,
	UPLOAD_STATE_FAILED,
])

UploadProgress.propTypes = {
	uploadState: UploadStatePropType,
	progressBytes: PropTypes.number,
	totalBytes: PropTypes.number,
}

export default function UploadProgress({uploadState, progressBytes, totalBytes}) {
	const progressPercent = 100 * (progressBytes / totalBytes)

	return (
		<Grid container spacing={2}>
			<Grid item xs zeroMinWidth>
				<Typography noWrap>{getMessageFromUploadState(uploadState)}</Typography>
			</Grid>
			<Grid item>
				<Typography align="right" noWrap>
					{bytesToMB(progressBytes)} of {bytesToMB(totalBytes)} MB
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<ProgressBar uploadState={uploadState} progressPercent={progressPercent} />
			</Grid>
		</Grid>
	)
}

UploadProgress.propTypes = {
	uploadState: UploadStatePropType,
	progressPercent: PropTypes.number,
}

function ProgressBar({uploadState, progressPercent}) {
	switch (uploadState) {
		case UPLOAD_STATE_EXTRACTING:
		case UPLOAD_STATE_PROCESSING:
			return <LinearProgress color="secondary" />
		case UPLOAD_STATE_UPLOADING:
			return <LinearProgress variant="determinate" value={progressPercent} />
		case UPLOAD_STATE_FAILED:
			return <LinearProgress color="secondary" variant="determinate" value={100} />
		default:
			return null
	}
}

function getMessageFromUploadState(uploadState) {
	switch (uploadState) {
		case UPLOAD_STATE_EXTRACTING:
			return 'Extracting audio...'
		case UPLOAD_STATE_UPLOADING:
			return 'Uploading audio...'
		case UPLOAD_STATE_PROCESSING:
			return 'Processing audio...'
		case UPLOAD_STATE_FAILED:
			return 'Upload failed.'
		case UPLOAD_STATE_COMPLETED:
			return 'Done!'
		default:
			throw new Error(`Unsupported progress state: ${uploadState}`)
	}
}

function bytesToMB(bytes) {
	return (bytes / 1048576).toFixed(2)
}
