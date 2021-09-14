import React from 'react'
import PropTypes from 'prop-types'
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import HelpIcon from '@material-ui/icons/Help'
import {BatchJobHistoryTable_batchJobsFragment} from './BatchJobHistoryTable.graphql'
import BatchJobHistoryRow from './BatchJobHistoryRow'

const useStyles = makeStyles(theme => ({
	helpIcon: {
		marginLeft: theme.spacing(1),
	},
}))

BatchJobHistoryTable.fragments = {
	batchJobs: BatchJobHistoryTable_batchJobsFragment,
}

BatchJobHistoryTable.propTypes = {
	batchJobs: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
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
		}).isRequired
	).isRequired,
}

export default function BatchJobHistoryTable({batchJobs}) {
	const classes = useStyles()

	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell padding="none">Name</TableCell>
						<TableCell>Status</TableCell>
						<TableCell align="center">Type</TableCell>
						<TableCell align="right">
							<Box display="flex" alignItems="center" justifyContent="flex-end">
								Batch Cost
								<Tooltip title="The cost of the whole batch. This is how much you'll be charged if all jobs in this batch complete successfully">
									<HelpIcon fontSize="inherit" className={classes.helpIcon} />
								</Tooltip>
							</Box>
						</TableCell>
						<TableCell align="center" padding="none">
							Actions
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{batchJobs.map(j => (
						<BatchJobHistoryRow key={j.id} batchJob={j} />
					))}
					{!batchJobs.length && (
						<TableRow>
							<TableCell colSpan={6}>
								<Box height={100} display="flex" alignItems="center" justifyContent="center">
									<Typography align="center">Looks like you haven&apos;t started any batch jobs</Typography>
								</Box>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
