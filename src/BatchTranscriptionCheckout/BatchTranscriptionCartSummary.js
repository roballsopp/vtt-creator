import React from 'react'
import PropTypes from 'prop-types'
import {useMutation, gql} from '@apollo/client'
import {useHistory} from 'react-router-dom'
import {Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tooltip, Typography} from '@material-ui/core'
import CancelIcon from '@material-ui/icons/DeleteForever'
import {BatchTranscribe} from '../common/icons'
import {handleError} from '../services/error-handler.service'
import {Button, usePromiseLazyQuery, useToast} from '../common'
import {removeBatch} from '../account/BatchJobHistoryTable.graphql'
import CreditDialog from '../common/CreditDialog'
import {useUpload} from './UploadProvider'

BatchTranscriptionCartSummary.propTypes = {
	batch: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		totalCost: PropTypes.number.isRequired,
		totalJobs: PropTypes.number.isRequired,
	}).isRequired,
}

export default function BatchTranscriptionCartSummary({batch}) {
	const toast = useToast()
	const history = useHistory()
	const {uploadState} = useUpload()

	const batchUploadState = React.useMemo(() => uploadState.batches[batch.id] || {uploading: false, uploads: []}, [
		uploadState.batches,
		batch.id,
	])

	const [creditDialogOpen, setCreditDialogOpen] = React.useState(false)
	const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)

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

	const [getCost, {loading: checkingCost}] = usePromiseLazyQuery(
		gql`
			query BatchSummaryGetCost($batchId: String!) {
				canIAffordBatch(batchId: $batchId)
			}
		`,
		{
			variables: {batchId: batch.id},
			fetchPolicy: 'no-cache',
		}
	)

	const handleCreditDialogClose = () => {
		setCreditDialogOpen(false)
	}

	const handleCreditDialogExited = justPaid => {
		if (justPaid) handleConfirmDialogOpen()
	}

	const handleConfirmDialogOpen = () => {
		getCost()
			.then(({data}) => {
				if (!data.canIAffordBatch) return setCreditDialogOpen(true)
				setConfirmDialogOpen(true)
			})
			.catch(err => {
				toast.error('There was a problem confirming the cost of this batch. Please try again.')
				handleError(err)
			})
	}

	const handleConfirmDialogClose = () => {
		setConfirmDialogOpen(false)
	}

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

	const handleStartBatch = () => {
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
		<React.Fragment>
			<Box p={4}>
				<Grid container spacing={4}>
					<Grid item xs={12}>
						<Typography variant="h6">Order Summary</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Batch Name: {batch.name}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body2">
							The amount shown below will be deducted immediately from your site credit.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body2">
							If you don&apos;t currently have enough credit to cover the cost, you&apos;ll be prompted to add more when
							you hit the &ldquo;Start Transcribing&rdquo; button.
						</Typography>
					</Grid>
					<Grid container item xs={12} justifyContent="space-between">
						<Typography variant="h6">Total cost:</Typography>
						<Typography variant="h6" align="right">
							${batch.totalCost.toFixed(2)}
						</Typography>
					</Grid>
					{batchUploadState.uploading && (
						<Grid container item xs={12} justifyContent="space-between">
							<Tooltip title="Cancel your current uploads first, then you can cancel this batch">
								<span>
									<Button color="primary" disabled startIcon={<CancelIcon />}>
										Cancel
									</Button>
								</span>
							</Tooltip>
							<Tooltip title="Wait for your current uploads to complete before starting the transcription process.">
								<span>
									<Button variant="contained" color="secondary" disabled startIcon={<BatchTranscribe />}>
										Start Transcribing
									</Button>
								</span>
							</Tooltip>
						</Grid>
					)}
					{!batchUploadState.uploading && (
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
								disabled={!batch.totalJobs || cancelling}
								loading={checkingCost || starting}
								startIcon={<BatchTranscribe />}
								onClick={handleConfirmDialogOpen}>
								Start Transcribing
							</Button>
						</Grid>
					)}
				</Grid>
			</Box>
			<CreditDialog
				cost={batch.totalCost || 0}
				open={creditDialogOpen}
				onExited={handleCreditDialogExited}
				onClose={handleCreditDialogClose}
			/>
			<Dialog
				open={confirmDialogOpen}
				onClose={handleConfirmDialogClose}
				aria-labelledby="confirm-transcribe-batch-title">
				<DialogTitle id="confirm-transcribe-batch-title">Start Transcribing Videos?</DialogTitle>
				<DialogContent>
					<Typography paragraph>
						This action will start the transcription process for the {batch.totalJobs} videos you have uploaded to this
						batch.
					</Typography>
					<Typography paragraph>${batch.totalCost.toFixed(2)} will be deducted from your account credit.</Typography>
					<Typography paragraph>Do you want to proceed?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleConfirmDialogClose} color="primary">
						Cancel
					</Button>
					<Button
						variant="contained"
						color="secondary"
						disabled={!batch.totalJobs || cancelling}
						loading={checkingCost || starting}
						startIcon={<BatchTranscribe />}
						onClick={handleStartBatch}
						autoFocus>
						Yes, Start Transcribing
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	)
}
