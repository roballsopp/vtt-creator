import * as React from 'react'
import PropTypes from 'prop-types'
import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TableRow,
	Toolbar,
	Typography,
} from '@material-ui/core'
import FolderIcon from '@material-ui/icons/FolderOpen'
import {useFileSelector} from '../common'
import {
	BatchTranscriptionTable_jobsFragment,
	BatchTranscriptionTable_totalsFragment,
} from './BatchTranscriptionTable.graphql'
import UploadDialog from './UploadDialog'
import {useUpload} from './UploadProvider'

BatchTranscriptionTable.fragments = {
	jobs: BatchTranscriptionTable_jobsFragment,
	totals: BatchTranscriptionTable_totalsFragment,
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
	totals: PropTypes.shape({
		totalCost: PropTypes.number.isRequired,
		totalDuration: PropTypes.number.isRequired,
	}).isRequired,
}

export default function BatchTranscriptionTable({batchId, jobs, totals}) {
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
			<Toolbar>
				<Typography variant="h6">Batch Transcription Summary</Typography>
				<Box flex={1} />
				{jobs.length ? (
					<Button variant="contained" color="secondary" startIcon={<FolderIcon />} onClick={openFileSelector}>
						Select Videos
					</Button>
				) : null}
			</Toolbar>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>File name</TableCell>
							<TableCell align="center">Language</TableCell>
							<TableCell align="right">Cost Per Min</TableCell>
							<TableCell align="right">Duration (minutes)</TableCell>
							<TableCell align="right">Job Cost</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{jobs.map(job => {
							return (
								<TableRow key={job.inputFile.id}>
									<TableCell>
										<Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden" width={300}>
											{job.inputFile.originalFileName}
										</Box>
									</TableCell>
									<TableCell align="center">{job.language}</TableCell>
									<TableCell align="right">${job.pricePerMin.toFixed(2)}</TableCell>
									<TableCell align="right">{(job.fileDuration / 60).toFixed(1)}</TableCell>
									<TableCell align="right">${job.cost.toFixed(2)}</TableCell>
								</TableRow>
							)
						})}
						{!jobs.length && (
							<TableRow>
								<TableCell colSpan={5}>
									<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4} px={10}>
										<Typography paragraph align="center">
											Have a large number of videos you&apos;d like to automatically extract captions for? You&apos;ve
											come to the right place!
										</Typography>
										<Typography paragraph align="center">
											Select some video files from your computer below to get started. Once your files have uploaded,
											you&apos;ll be able to select the language each video is spoken in, and see the total cost of
											extracting captions from all of the videos you&apos;ve selected before we start extracting
											captions.
										</Typography>
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
					<TableFooter>
						<TableRow>
							<TableCell colSpan={3} align="right">
								Total
							</TableCell>
							<TableCell align="right">{(totals.totalDuration / 60).toFixed(1)}</TableCell>
							<TableCell align="right">${totals.totalCost.toFixed(2)}</TableCell>
						</TableRow>
					</TableFooter>
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
