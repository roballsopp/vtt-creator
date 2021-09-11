import * as React from 'react'
import PropTypes from 'prop-types'
import {Box, Button, List, Typography} from '@material-ui/core'
import FolderIcon from '@material-ui/icons/FolderOpen'
import {useFileSelector} from '../common'
import {BatchTranscriptionCart_jobsFragment} from './BatchTranscriptionCart.graphql'
import UploadDialog from './UploadDialog'
import {useUpload} from './UploadProvider'
import BatchTranscriptionCartItem from './BatchTranscriptionCartItem'
import BatchLanguageSelector from './BatchLanguageSelector'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
	emptyList: {
		listStyleType: 'decimal',
		margin: 0,
		paddingInlineStart: theme.spacing(5),
		'& li': {
			...theme.typography.body1,
			margin: theme.spacing(4, 0),
		},
	},
}))

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
	const classes = useStyles()

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
					<Typography align="center" variant="h6" gutterBottom>
						Lets make some captions!
					</Typography>
					<Typography variant="h4" align="center">
						1
					</Typography>
					<Typography variant="body1" paragraph align="center">
						Select some video files to upload from your computer below.
					</Typography>
					<Typography variant="h4" align="center">
						2
					</Typography>
					<Typography variant="body1" paragraph align="center">
						Once your files have uploaded, select the language each video is spoken in.
					</Typography>
					<Typography variant="h4" align="center">
						3
					</Typography>
					<Typography variant="body1" paragraph align="center">
						Review the total cost of the batch transcription job to the left.
					</Typography>
					<Typography variant="h4" align="center">
						4
					</Typography>
					<Typography variant="body1" paragraph align="center">
						Click &ldquo;Start Transcribing&rdquo;, and wait for your transcription to complete.
					</Typography>
					<Typography variant="h4" align="center">
						5
					</Typography>
					<Typography variant="body1" paragraph align="center">
						Download a zip file containing captions in VTT and SRT format for each video you uploaded.
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
