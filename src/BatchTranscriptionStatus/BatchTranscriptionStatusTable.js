import * as React from 'react'
import PropTypes from 'prop-types'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core'
import JobStatusIndicator from '../common/JobStatusIndicator'
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
			inputFile: PropTypes.shape({
				id: PropTypes.string.isRequired,
				originalFileName: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired
	).isRequired,
}

export default function BatchTranscriptionStatusTable({jobs}) {
	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>File Name</TableCell>
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
								<TableCell>{job.inputFile.originalFileName}</TableCell>
								<TableCell>
									<JobStatusIndicator job={job} />
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
