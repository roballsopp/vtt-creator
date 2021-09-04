import * as React from 'react'
import PropTypes from 'prop-types'
import {gql, useMutation} from '@apollo/client'
import {Box, Grid, IconButton, ListItem, Tooltip, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import DeleteIcon from '@material-ui/icons/DeleteForever'
import {handleError} from '../services/error-handler.service'
import {useToast} from '../common'
import {removeJob} from '../account/JobHistoryTable.graphql'
import TranscriptionLanguageSelector from './TranscriptionLanguageSelector'
import {removeJobFromBatch} from './BatchTranscriptionCart.graphql'

const useStyles = makeStyles(theme => ({
	root: {
		borderTop: `1px solid ${theme.palette.divider}`,
	},
}))

BatchTranscriptionCartItem.propTypes = {
	job: PropTypes.shape({
		id: PropTypes.string.isRequired,
		batchId: PropTypes.string.isRequired,
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

export default function BatchTranscriptionCartItem({job}) {
	const toast = useToast()
	const classes = useStyles()

	const [deleteJob, {loading}] = useMutation(
		gql`
			mutation deleteJob($jobId: String!) {
				deleteTranscription(jobId: $jobId) {
					batch {
						id
						pendingCharges
						totalJobs
					}
				}
			}
		`,
		{
			update(cache) {
				removeJobFromBatch(cache, job.batchId, job)
				removeJob(cache, job.id)
			},
			onError: err => {
				handleError(err)
				toast.error('There was a problem removing this job. Please try again')
			},
		}
	)

	function handleDeleteJob() {
		deleteJob({variables: {jobId: job.id}})
	}

	return (
		<ListItem className={classes.root}>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<Typography variant="caption">File Name:</Typography>
					<Tooltip title={job.inputFile.originalFileName}>
						<Typography noWrap style={{width: 300}} gutterBottom>
							{job.inputFile.originalFileName}
						</Typography>
					</Tooltip>
					<Typography variant="caption">Duration:</Typography>
					<Typography>{(job.fileDuration / 60).toFixed(1)} minutes</Typography>
					<TranscriptionLanguageSelector job={job} />
				</Grid>
				<Grid container item xs={6} direction="column" alignItems="flex-end">
					<Tooltip title="Remove">
						<IconButton aria-label="Delete" disabled={loading} onClick={handleDeleteJob} edge="end">
							<DeleteIcon />
						</IconButton>
					</Tooltip>
					<Box flex={1} />
					<div>
						<Typography variant="subtitle2" component="span">
							<Tooltip title="Transcription cost per minute of video">
								<span>${job.pricePerMin.toFixed(2)}</span>
							</Tooltip>
							&nbsp;&times;&nbsp;
							<Tooltip title="Length of video">
								<span>{(job.fileDuration / 60).toFixed(1)}</span>
							</Tooltip>
							&nbsp;=&nbsp;
						</Typography>
						<Typography variant="h6" component="span">
							<Tooltip title="Cost of transcription">
								<span>${job.cost.toFixed(2)}</span>
							</Tooltip>
						</Typography>
					</div>
				</Grid>
			</Grid>
		</ListItem>
	)
}
