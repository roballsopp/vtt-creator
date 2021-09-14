import React from 'react'
import PropTypes from 'prop-types'
import {format} from 'date-fns'
import {Box, Tooltip} from '@material-ui/core'
import StatusBubble from './StatusBubble'

JobStatusIndicator.propTypes = {
	job: PropTypes.shape({
		id: PropTypes.string.isRequired,
		state: PropTypes.string.isRequired,
		createdAt: PropTypes.string.isRequired,
		updatedAt: PropTypes.string,
	}).isRequired,
}

export default function JobStatusIndicator({job}) {
	return (
		<Tooltip title={getTooltipText(job)}>
			<Box component="span" display="inline-flex" alignItems="center">
				<StatusBubble status={job.state} />
				{getStatusText(job)}
			</Box>
		</Tooltip>
	)
}

function getTooltipText(job) {
	if (job.state === 'success') {
		return `Finished on ${format(new Date(job.updatedAt), 'LLL dd, yyyy h:mm aaa')}`
	}

	if (job.state === 'pending') {
		return `Started on ${format(new Date(job.updatedAt), 'LLL dd, yyyy h:mm aaa')}`
	}

	if (job.state === 'error') {
		return `Failed on ${format(new Date(job.updatedAt), 'LLL dd, yyyy h:mm aaa')}`
	}

	if (job.state === 'cancelled') {
		return `Cancelled on ${format(new Date(job.updatedAt), 'LLL dd, yyyy h:mm aaa')}`
	}

	return `Created on ${format(new Date(job.createdAt), 'LLL dd, yyyy h:mm aaa')}`
}

function getStatusText(job) {
	if (job.state === 'success') {
		return 'Finished'
	}

	if (job.state === 'pending') {
		return 'Running'
	}

	if (job.state === 'error') {
		return 'Failed'
	}

	if (job.state === 'cancelled') {
		return 'Started'
	}

	return 'Not Started'
}
