import React from 'react'
import PropTypes from 'prop-types'
import {useMutation, gql} from '@apollo/client'
import {useHistory} from 'react-router-dom'
import {Box, Grid, Tooltip, Typography} from '@material-ui/core'
import CancelIcon from '@material-ui/icons/DeleteForever'
import CaptionsIcon from '@material-ui/icons/ClosedCaption'
import {handleError} from '../services/error-handler.service'
import {Button, useToast} from '../common'
import {removeBatch} from '../account/BatchJobHistoryTable.graphql'

BatchTranscriptionCartSummary.propTypes = {
	batch: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		jobs: PropTypes.shape({
			totalCount: PropTypes.number.isRequired,
			totalCost: PropTypes.number.isRequired,
		}).isRequired,
	}).isRequired,
}

export default function BatchTranscriptionCartSummary({batch}) {
	const toast = useToast()
	const history = useHistory()

	const [cancelBatch, {loading: cancelling}] = useMutation(
		gql`
			mutation cancelBatch($batchId: String!) {
				deleteBatch(batchId: $batchId) {
					batchId
				}
			}
		`,
		{
			update: (cache, {data: {deleteBatch}}) => {
				removeBatch(cache, deleteBatch.batchId)
			},
		}
	)

	const [startBatch, {loading: starting}] = useMutation(
		gql`
			mutation startBatch($batchId: String!) {
				startBatch(batchId: $batchId) {
					batch {
						id
						startedAt
					}
				}
			}
		`
	)

	const handleCancelBatch = async () => {
		cancelBatch({variables: {batchId: batch.id}})
			.then(() => {
				history.push('/editor')
			})
			.catch(err => {
				toast.error('There was a problem cancelling this batch. Please try again.')
				handleError(err)
			})
	}

	const handleStartBatch = async () => {
		startBatch({variables: {batchId: batch.id}})
			.then(() => {
				history.replace(`/batches/${batch.id}/status`)
			})
			.catch(err => {
				toast.error('There was a problem starting this batch. Please try again.')
				handleError(err)
			})
	}

	return (
		<Box p={4}>
			<Grid container spacing={4}>
				<Grid item xs={12}>
					<Typography variant="h6">Order Summary</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="subtitle2">Batch Name: {batch.name}</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="body2">The amount shown below will be deducted from your site credit.</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="body2">
						You won&apos;t be charged the entire amount right away, but rather you&apos;ll be charged as each video
						completes successfully.
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="body2">You will not be charged for any transcription that fails.</Typography>
				</Grid>
				<Grid container item xs={12} justifyContent="space-between">
					<Typography variant="h6">Total cost:</Typography>
					<Typography variant="h6" align="right">
						${batch.jobs.totalCost.toFixed(2)}
					</Typography>
				</Grid>
				<Grid container item xs={12} justifyContent="space-between">
					<Tooltip title="Cancel and discard this batch">
						<span>
							<Button
								color="primary"
								disabled={starting}
								loading={cancelling}
								startIcon={<CancelIcon />}
								onClick={handleCancelBatch}>
								Cancel
							</Button>
						</span>
					</Tooltip>
					<Button
						variant="contained"
						color="secondary"
						disabled={!batch.jobs.totalCount || cancelling}
						loading={starting}
						startIcon={<CaptionsIcon />}
						onClick={handleStartBatch}>
						Start Transcribing
					</Button>
				</Grid>
			</Grid>
		</Box>
	)
}
