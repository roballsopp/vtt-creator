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

	return (
		<Dialog maxWidth="sm" fullWidth open={open} onClose={onClose} aria-labelledby="batch-create-dialog-title">
			<Title id="batch-create-dialog-title" disableTypography>
				<Typography variant="h6">Create Batch</Typography>
				<IconButton aria-label="Close" edge="end" onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Typography paragraph>Have a bunch of videos you want to extract captions for all at once?</Typography>
				<Typography paragraph>You clicked the right thing!</Typography>
				<Typography paragraph>Before we proceed, give this batch of videos a name so you can find it later.</Typography>
				<div>
					<TextField
						variant="outlined"
						label="Name"
						value={batchName}
						placeholder="CSCI 5866 Fall 2021 Lectures"
						fullWidth
						onChange={handleChangeBatchName}
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button name="Batch Cancel" onClick={onClose} color="primary">
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
