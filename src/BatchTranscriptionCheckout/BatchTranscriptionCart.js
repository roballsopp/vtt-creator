import * as React from 'react'
import PropTypes from 'prop-types'
import {Box, Button, List, ListItem, ListItemText, Typography} from '@material-ui/core'
import FolderIcon from '@material-ui/icons/FolderOpen'
import {useFileSelector} from '../common'
import {BatchTranscriptionCart_jobsFragment} from './BatchTranscriptionCart.graphql'
import UploadDialog from './UploadDialog'
import {useUpload} from './UploadProvider'
import BatchTranscriptionCartItem from './BatchTranscriptionCartItem'
import BatchLanguageSelector from './BatchLanguageSelector'

BatchTranscriptionCart.fragments = {
	jobs: BatchTranscriptionCart_jobsFragment,
}

BatchTranscriptionCart.propTypes = {
	batchId: PropTypes.string.isRequired,
	jobs: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
		}).isRequired
	).isRequired,
}

export default function BatchTranscriptionCart({batchId, jobs}) {
	const {handleAddFiles} = useUpload()

	const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false)

	const handleOpenUploadDialog = () => {
		setUploadDialogOpen(true)
	}

	const handleCloseUploadDialog = () => {
		setUploadDialogOpen(false)
	}

	const handleFilesSelected = e => {
		handleAddFiles(batchId, [...e.target.files])
		setUploadDialogOpen(true)
	}

	const openFileSelector = useFileSelector({accept: 'video/*', multiple: true, onFilesSelected: handleFilesSelected})

	return (
		<React.Fragment>
			{jobs.length ? (
				<Box display="flex" px={4} alignItems="center">
					<Box>
						<Button variant="contained" color="secondary" startIcon={<FolderIcon />} onClick={openFileSelector}>
							Add More Videos
						</Button>
					</Box>
					<Box flex={1} />
					<BatchLanguageSelector batchId={batchId} />
				</Box>
			) : null}
			{Boolean(jobs.length) && (
				<List>
					{jobs.map(job => {
						return <BatchTranscriptionCartItem job={job} key={job.id} />
					})}
				</List>
			)}
			{!jobs.length && (
				<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" px={10} py={6}>
					<Typography align="center" variant="h6">
						Lets make some captions!
					</Typography>
					<List>
						<ListItem>
							<ListItemText primary="1. Select some video files to upload from your computer below." />
						</ListItem>
						<ListItem>
							<ListItemText primary="2. Once your files have uploaded, select the language each video is spoken in." />
						</ListItem>
						<ListItem>
							<ListItemText primary="3. Review the total cost of the batch transcription job to the right." />
						</ListItem>
						<ListItem>
							<ListItemText primary={'4. Click "Start Transcribing", and wait for your transcription to complete.'} />
						</ListItem>
					</List>
					<Box marginTop={4}>
						<Button
							variant="contained"
							color="secondary"
							size="large"
							startIcon={<FolderIcon />}
							onClick={openFileSelector}>
							Select Videos
						</Button>
					</Box>
				</Box>
			)}
			<UploadDialog
				open={uploadDialogOpen}
				batchId={batchId}
				onOpen={handleOpenUploadDialog}
				onClose={handleCloseUploadDialog}
			/>
		</React.Fragment>
	)
}