import React from 'react'
import PropTypes from 'prop-types'
import {useMutation, gql} from '@apollo/client'
import {useHistory} from 'react-router-dom'
import {Box, Button, Grid, Typography} from '@material-ui/core'
import {handleError} from '../services/error-handler.service'
import {useToast} from '../common'
import {removeBatch} from '../account/BatchJobHistoryTable.graphql'

BatchTranscriptionCheckoutSummary.propTypes = {
	batchId: PropTypes.string.isRequired,
	totalCost: PropTypes.number.isRequired,
	batchHasJobs: PropTypes.bool.isRequired,
}

export default function BatchTranscriptionCheckoutSummary({batchId, totalCost, batchHasJobs}) {
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

	const handleCancelBatch = async () => {
		cancelBatch({variables: {batchId}})
			.then(() => {
				history.push('/editor')
			})
			.catch(err => {
				toast.error('There was a problem cancelling this batch. Please try again.')
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
					<Typography variant="body2">The amount shown below will be deducted from your site credit.</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="body2">
						You won&apos;t be charged the entire amount right away, but rather you&apos;ll be charged for individual
						jobs as they complete successfully.
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="body2">You will not be charged for any job that fails.</Typography>
				</Grid>
				<Grid container item xs={12} justifyContent="space-between">
					<Typography variant="h6">Total cost:</Typography>
					<Typography variant="h6" align="right">
						${totalCost.toFixed(2)}
					</Typography>
				</Grid>
				<Grid container item xs={12} justifyContent="space-between">
					<Button color="primary" disabled={cancelling} onClick={handleCancelBatch}>
						Cancel
					</Button>
					<Button variant="contained" color="secondary" disabled={!batchHasJobs}>
						Start Transcribing
					</Button>
				</Grid>
			</Grid>
		</Box>
	)
}
