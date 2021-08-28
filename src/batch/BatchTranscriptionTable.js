import * as React from 'react'
import PropTypes from 'prop-types'
import {
	Box,
	Button,
	List,
	ListItem,
	ListItemText,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
} from '@material-ui/core'
import FolderIcon from '@material-ui/icons/FolderOpen'
import {useFileSelector} from '../common'
import {BatchTranscriptionTable_jobsFragment} from './BatchTranscriptionTable.graphql'
import UploadDialog from './UploadDialog'
import {useUpload} from './UploadProvider'
import BatchTranscriptionRow from './BatchTranscriptionRow'
import BatchLanguageSelector from './BatchLanguageSelector'

BatchTranscriptionTable.fragments = {
	jobs: BatchTranscriptionTable_jobsFragment,
}

BatchTranscriptionTable.propTypes = {
	batchId: PropTypes.string.isRequired,
	jobs: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
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
		}).isRequired
	).isRequired,
}

export default function BatchTranscriptionTable({batchId, jobs}) {
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
						<Button
							variant="contained"
							color="secondary"
							size="large"
							startIcon={<FolderIcon />}
							onClick={openFileSelector}>
							Add More Videos
						</Button>
					</Box>
					<Box flex={1} />
					<BatchLanguageSelector batchId={batchId} />
				</Box>
			) : null}
			<TableContainer>
				<Table>
					<TableBody>
						{jobs.map(job => {
							return <BatchTranscriptionRow job={job} key={job.inputFile.id} />
						})}
						{!jobs.length && (
							<TableRow>
								<TableCell colSpan={2}>
									<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" px={10}>
										<Typography align="center" variant="h6">
											Welcome!
										</Typography>
										<List>
											<ListItem>
												<ListItemText primary="1. Select some video files to upload from your computer below." />
											</ListItem>
											<ListItem>
												<ListItemText primary="2. Once your files have uploaded, select the language each video is spoken in." />
											</ListItem>
											<ListItem>
												<ListItemText primary="3. Review the total cost of the batch extraction job to the right." />
											</ListItem>
											<ListItem>
												<ListItemText
													primary={'4. Click "Start Transcribing", and wait for your transcription to complete.'}
												/>
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
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<UploadDialog
				open={uploadDialogOpen}
				batchId={batchId}
				onOpen={handleOpenUploadDialog}
				onClose={handleCloseUploadDialog}
			/>
		</React.Fragment>
	)
}
