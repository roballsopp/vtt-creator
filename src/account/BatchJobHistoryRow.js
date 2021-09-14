import React from 'react'
import PropTypes from 'prop-types'
import {Box, TableCell, TableRow, Tooltip} from '@material-ui/core'
import TranslateIcon from '@material-ui/icons/Translate'
import BatchJobActionMenu from './BatchJobActionMenu'
import {BatchTranscribe} from '../common/icons'
import BatchStatusIndicator from '../common/BatchStatusIndicator'

BatchJobHistoryRow.propTypes = {
	batchJob: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		jobType: PropTypes.oneOf(['transcription', 'translation']).isRequired,
		createdAt: PropTypes.string.isRequired,
		startedAt: PropTypes.string,
		finishedAt: PropTypes.string,
		totalCost: PropTypes.number.isRequired,
		totalJobs: PropTypes.number.isRequired,
		startedJobs: PropTypes.number.isRequired,
		cancelledJobs: PropTypes.number.isRequired,
		failedJobs: PropTypes.number.isRequired,
		finishedJobs: PropTypes.number.isRequired,
	}).isRequired,
}

export default function BatchJobHistoryRow({batchJob}) {
	return (
		<React.Fragment>
			<TableRow>
				<TableCell padding="none">{batchJob.name}</TableCell>
				<TableCell>
					<BatchStatusIndicator batchJob={batchJob} />
				</TableCell>
				<TableCell align="center" padding="none">
					<Box display="flex" alignItems="center" justifyContent="center">
						<JobTypeIcon type={batchJob.jobType} />
					</Box>
				</TableCell>
				<TableCell align="right">${batchJob.totalCost.toFixed(2)}</TableCell>
				<TableCell align="center" padding="none">
					<BatchJobActionMenu batchJob={batchJob} />
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}

function JobTypeIcon({type}) {
	if (type === 'transcription') {
		return (
			<Tooltip title="The batch contains caption transcriptions">
				<BatchTranscribe />
			</Tooltip>
		)
	}

	if (type === 'translation') {
		return (
			<Tooltip title="The batch contains caption translations">
				<TranslateIcon />
			</Tooltip>
		)
	}

	return null
}
