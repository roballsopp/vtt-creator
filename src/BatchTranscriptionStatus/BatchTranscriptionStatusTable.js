import * as React from 'react'
import PropTypes from 'prop-types'
import {format} from 'date-fns'
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from '@material-ui/core'
import StatusBubble from '../common/StatusBubble'
import {BatchTranscriptionStatusTable_jobsFragment} from './BatchTranscriptionStatusTable.graphql'

BatchTranscriptionStatusTable.fragments = {
	jobs: BatchTranscriptionStatusTable_jobsFragment,
}

BatchTranscriptionStatusTable.propTypes = {
	jobs: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			cost: PropTypes.number.isRequired,
			fileDuration: PropTypes.number.isRequired,
			language: PropTypes.string.isRequired,
			state: PropTypes.string.isRequired,
			createdAt: PropTypes.string.isRequired,
			updatedAt: PropTypes.string.isRequired,
		}).isRequired
	).isRequired,
}

export default function BatchTranscriptionStatusTable({jobs}) {
	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Status</TableCell>
						<TableCell align="right">Job Cost</TableCell>
						<TableCell align="right">Audio Duration (minutes)</TableCell>
						<TableCell align="center" padding="none">
							Audio Language
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{jobs.map(job => {
						return (
							<TableRow key={job.id}>
								<TableCell>
									<Box display="flex" alignItems="center">
										<StatusBubble status={job.state} /> {getStatusText(job)}
									</Box>
								</TableCell>
								<TableCell align="right">${job.cost.toFixed(2)}</TableCell>
								<TableCell align="right">{(job.fileDuration / 60).toFixed(1)}</TableCell>
								<TableCell align="center" padding="none">
									{job.language}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

function getStatusText(job) {
	if (job.state === 'success') {
		return (
			<Tooltip title={`Finished on ${format(new Date(job.updatedAt), 'LLL dd, yyyy h:mm aaa')}`}>
				<span>Finished</span>
			</Tooltip>
		)
	}

	if (job.state === 'pending') {
		return (
			<Tooltip title={`Started on ${format(new Date(job.updatedAt), 'LLL dd, yyyy h:mm aaa')}`}>
				<span>Running</span>
			</Tooltip>
		)
	}

	if (job.state === 'error') {
		return (
			<Tooltip title={`Failed on ${format(new Date(job.updatedAt), 'LLL dd, yyyy h:mm aaa')}`}>
				<span>Failed</span>
			</Tooltip>
		)
	}

	if (job.state === 'cancelled') {
		return (
			<Tooltip title={`Cancelled on ${format(new Date(job.updatedAt), 'LLL dd, yyyy h:mm aaa')}`}>
				<span>Started</span>
			</Tooltip>
		)
	}

	return (
		<Tooltip title={`Created on ${format(new Date(job.createdAt), 'LLL dd, yyyy h:mm aaa')}`}>
			<span>Not Started</span>
		</Tooltip>
	)
}
