import * as React from 'react'
import PropTypes from 'prop-types'
import {format} from 'date-fns'
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@material-ui/core'
import StatusBubble from './StatusBubble'
import {JobHistoryTable_jobsFragment} from './JobHistoryTable.graphql'
import JobActionMenu from './JobActionMenu'

JobHistoryTable.fragments = {
	jobs: JobHistoryTable_jobsFragment,
}

JobHistoryTable.propTypes = {
	jobs: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			cost: PropTypes.number.isRequired,
			fileDuration: PropTypes.number.isRequired,
			language: PropTypes.string.isRequired,
			state: PropTypes.string.isRequired,
			createdAt: PropTypes.string.isRequired,
		}).isRequired
	).isRequired,
}

export default function JobHistoryTable({jobs}) {
	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell padding="none">Started At</TableCell>
						<TableCell>Status</TableCell>
						<TableCell align="right">Job Cost</TableCell>
						<TableCell align="right">Audio Duration (minutes)</TableCell>
						<TableCell align="center">Audio Language</TableCell>
						<TableCell align="center" padding="none">
							Actions
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{jobs.map(job => {
						return (
							<TableRow key={job.id}>
								<TableCell padding="none">{format(new Date(job.createdAt), 'LLL dd, yyyy h:mm aaa')}</TableCell>
								<TableCell>
									<Box display="flex" alignItems="center">
										<StatusBubble status={job.state} />
										{job.state}
									</Box>
								</TableCell>
								<TableCell align="right">${job.cost.toFixed(2)}</TableCell>
								<TableCell align="right">{(job.fileDuration / 60).toFixed(1)}</TableCell>
								<TableCell align="center">{job.language}</TableCell>
								<TableCell align="center" padding="none">
									<JobActionMenu job={job} />
								</TableCell>
							</TableRow>
						)
					})}
					{!jobs.length && (
						<TableRow>
							<TableCell colSpan={5}>
								<Box height={100} display="flex" alignItems="center" justifyContent="center">
									<Typography align="center">Looks like you haven&apos;t extracted any cues yet</Typography>
								</Box>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
