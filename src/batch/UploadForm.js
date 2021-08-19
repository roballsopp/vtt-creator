import * as React from 'react'
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

export default function UploadForm() {
	const {uploadState, handleUpload, handleAddFiles, handleRemoveFile} = useUpload()

	const handleFilesSelected = e => {
		handleAddFiles([...e.target.files])
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
						disabled={uploadState.uploading || !uploadState.uploads.length}
						onClick={handleUpload}>
						Upload
					</Button>
				</Box>
			</Box>
			<List disablePadding>
				{uploadState.uploads.map((u, i) => (
					<ListItem key={i}>
						<ListItemText
							disableTypography
							primary={<Typography>{u.file.name}</Typography>}
							secondary={<LinearProgress variant="determinate" value={(u.loaded / u.total) * 100} />}
						/>
						<ListItemSecondaryAction>
							<IconButton edge="end" disabled={uploadState.uploading} onClick={() => handleRemoveFile(i)}>
								<CloseIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
		</Box>
	)
}
