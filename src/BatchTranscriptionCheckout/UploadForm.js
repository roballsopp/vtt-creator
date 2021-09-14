import React from 'react'
import * as PropTypes from 'prop-types'
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import UploadIcon from '@material-ui/icons/CloudUpload'
import FolderIcon from '@material-ui/icons/FolderOpen'
import {useFileSelector} from '../common'
import {useUpload} from './UploadProvider'

UploadForm.propTypes = {
	batchId: PropTypes.string.isRequired,
}

export default function UploadForm({batchId}) {
	const {uploadState, handleUpload, handleAddFiles, handleRemoveFile} = useUpload()

	const batchUploads = React.useMemo(() => uploadState.uploads[batchId] || [], [uploadState.uploads, batchId])

	const handleFilesSelected = e => {
		handleAddFiles(batchId, [...e.target.files])
	}

	const openFileSelector = useFileSelector({accept: 'video/*', multiple: true, onFilesSelected: handleFilesSelected})

	return (
		<Box minWidth={400} width="100%">
			<Box display="flex" alignItems="center" justifyContent="space-between" px={4} py={2}>
				<Box>
					<Button variant="contained" color="primary" startIcon={<FolderIcon />} onClick={openFileSelector}>
						Select Files
					</Button>
				</Box>
				<Box>
					<Button
						variant="contained"
						color="secondary"
						startIcon={<UploadIcon />}
						disabled={uploadState.uploading || !batchUploads.length}
						onClick={() => handleUpload(batchId)}>
						Upload
					</Button>
				</Box>
			</Box>
			<List disablePadding>
				{batchUploads.map(u => (
					<ListItem key={u.id}>
						<ListItemText
							disableTypography
							primary={<Typography>{u.file.name}</Typography>}
							secondary={<LinearProgress variant="determinate" value={(u.loaded / u.total) * 100} />}
						/>
						<ListItemSecondaryAction>
							<IconButton edge="end" disabled={u.state !== 'queued'} onClick={() => handleRemoveFile(batchId, u.id)}>
								<CloseIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
		</Box>
	)
}
