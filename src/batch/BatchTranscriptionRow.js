import * as React from 'react'
import PropTypes from 'prop-types'
import {Box, TableCell, TableRow, Tooltip, Typography} from '@material-ui/core'
import TranscriptionLanguageSelector from './TranscriptionLanguageSelector'

BatchTranscriptionRow.propTypes = {
	job: PropTypes.shape({
		id: PropTypes.string.isRequired,
		cost: PropTypes.number.isRequired,
		pricePerMin: PropTypes.number.isRequired,
		fileDuration: PropTypes.number.isRequired,
		language: PropTypes.string.isRequired,
		state: PropTypes.string.isRequired,
		createdAt: PropTypes.string.isRequired,
		inputFile: PropTypes.shape({
			id: PropTypes.string.isRequired,
			originalFileName: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
}

export default function BatchTranscriptionRow({job}) {
	return (
		<TableRow>
			<TableCell>
				<Typography variant="caption">File Name:</Typography>
				<Tooltip title={job.inputFile.originalFileName}>
					<Typography noWrap style={{width: 300}} gutterBottom>
						{job.inputFile.originalFileName}
					</Typography>
				</Tooltip>
				<Typography variant="caption">Duration:</Typography>
				<Typography>{(job.fileDuration / 60).toFixed(1)} minutes</Typography>
				<TranscriptionLanguageSelector job={job} />
			</TableCell>
			<TableCell align="right">
				<Tooltip title="Transcription cost per minute of video">
					<span>${job.pricePerMin.toFixed(2)}</span>
				</Tooltip>
				&nbsp;&times;&nbsp;
				<Tooltip title="Length of video">
					<span>{(job.fileDuration / 60).toFixed(1)}</span>
				</Tooltip>
				&nbsp;=&nbsp;
				<Tooltip title="Cost of transcription">
					<strong>${job.cost.toFixed(2)}</strong>
				</Tooltip>
			</TableCell>
		</TableRow>
	)
}
