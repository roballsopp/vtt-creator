import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import {Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import {styled} from '@material-ui/styles'
import {Button} from './common'
import TextField from '@material-ui/core/TextField'
import {TranscriptionCost} from './config'
import {gql, useMutation} from '@apollo/client'
import {useAuthDialog} from './AuthDialog'
import {useHistory} from 'react-router-dom'
import {appendBatch, BatchJobHistoryTable_batchJobsFragment} from './account/BatchJobHistoryTable.graphql'

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
})

CreateBatchDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
}

export default function CreateBatchDialog({open, onClose}) {
	const [batchName, setBatchName] = React.useState('')

	const history = useHistory()
	const {openLoginDialog} = useAuthDialog()

	const [createBatch, {loading: creatingBatch}] = useMutation(
		gql`
			mutation createBatch($batchName: String!) {
				createBatch(jobType: TRANSCRIPTION, name: $batchName) {
					batch {
						id
						...BatchJobHistoryTable_batchJobs
					}
				}
			}
			${BatchJobHistoryTable_batchJobsFragment}
		`,
		{
			update: (cache, {data: {createBatch}}) => {
				appendBatch(cache, createBatch.batch)
			},
		}
	)

	const handleChangeBatchName = e => {
		setBatchName(e.target.value)
	}

	const handleCreateBatch = () => {
		onClose()
		createBatch({variables: {batchName}})
			.then(({data}) => {
				setBatchName('')
				history.push(`/batches/${data.createBatch.batch.id}/edit`)
			})
			.catch(() => {
				openLoginDialog(
					`Automatic caption extraction costs $${TranscriptionCost.toFixed(
						2
					)} per minute of video and requires an account. Please login or sign up below.`
				).then(justLoggedIn => {
					if (justLoggedIn) handleCreateBatch()
				})
			})
	}

	const handleUserClose = () => {
		setBatchName('')
		onClose()
	}

	return (
		<Dialog maxWidth="sm" fullWidth open={open} onClose={handleUserClose} aria-labelledby="batch-create-dialog-title">
			<Title id="batch-create-dialog-title" disableTypography>
				<Typography variant="h6">Batch Transcribe</Typography>
				<IconButton aria-label="Close" edge="end" onClick={handleUserClose}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Typography paragraph>
					Do you have a bunch of videos you want to automatically create captions for without lifting a finger?
				</Typography>
				<Typography paragraph>You&apos;ve come to the right place!</Typography>
				<Typography paragraph>
					<strong>Batch Transcribe</strong> leverages machine learning technology to convert the speech in your videos
					into text, break the text into synced captions, and provide you with zipped VTT and SRT files for each video
					you upload in minutes.
				</Typography>
				<Typography paragraph>
					If you&apos;d like to start now, give your batch of videos a name below so you can find it later.
				</Typography>
				<div>
					<TextField
						variant="outlined"
						label="Batch Name"
						value={batchName}
						placeholder="CSCI 5866 Fall 2021 Lectures"
						fullWidth
						onChange={handleChangeBatchName}
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button name="Batch Cancel" onClick={handleUserClose} color="primary">
					Cancel
				</Button>
				<Button
					name="Batch Next"
					color="secondary"
					variant="contained"
					loading={creatingBatch}
					onClick={handleCreateBatch}>
					Next
				</Button>
			</DialogActions>
		</Dialog>
	)
}
