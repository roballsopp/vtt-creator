import React from 'react'
import PropTypes from 'prop-types'
import {format} from 'date-fns'
import {Box, CircularProgress, Tooltip} from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/green'

BatchStatusIndicator.propTypes = {
	batchJob: PropTypes.shape({
		id: PropTypes.string.isRequired,
		createdAt: PropTypes.string.isRequired,
		startedAt: PropTypes.string,
		finishedAt: PropTypes.string,
	}).isRequired,
}

export default function BatchStatusIndicator({batchJob}) {
	return (
		<Tooltip title={getTooltipText(batchJob)}>
			<Box component="span" display="inline-flex" alignItems="center">
				<Bubble batchJob={batchJob} />
				{getStatusText(batchJob)}
			</Box>
		</Tooltip>
	)
}

function Bubble({batchJob}) {
	if (batchJob.finishedAt) {
		return (
			<Box
				component="span"
				width="1em"
				height="1em"
				borderRadius="0.5em"
				mr={2}
				bgcolor={green[500]}
				display="inline-block"
			/>
		)
	}

	if (batchJob.startedAt) {
		return (
			<Box mr={2}>
				<CircularProgress size="1em" />
			</Box>
		)
	}

	return (
		<Box
			component="span"
			width="1em"
			height="1em"
			borderRadius="0.5em"
			mr={2}
			bgcolor={blue[400]}
			display="inline-block"
		/>
	)
}

function getTooltipText(batchJob) {
	if (batchJob.finishedAt) {
		return `Finished on ${format(new Date(batchJob.finishedAt), 'LLL dd, yyyy h:mm aaa')}`
	}

	if (batchJob.startedAt) {
		return `Started on ${format(new Date(batchJob.startedAt), 'LLL dd, yyyy h:mm aaa')}`
	}

	return `Created on ${format(new Date(batchJob.createdAt), 'LLL dd, yyyy h:mm aaa')}`
}

function getStatusText(batchJob) {
	if (batchJob.finishedAt) {
		return 'Finished'
	}

	if (batchJob.startedAt) {
		return 'Running'
	}

	return 'Not Started'
}
