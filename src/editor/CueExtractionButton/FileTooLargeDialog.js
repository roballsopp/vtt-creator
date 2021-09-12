import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import {styled} from '@material-ui/styles'
import {Button} from '../../common'

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
})

FileTooLargeDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
}

export default function FileTooLargeDialog({open, onClose}) {
	return (
		<Dialog maxWidth="sm" fullWidth open={open} onClose={onClose} aria-labelledby="file-too-large-title">
			<Title id="file-too-large-title" disableTypography>
				<Typography variant="h6">File Too Large</Typography>
				<IconButton aria-label="Close" edge="end" onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Typography>
					This video file is over 5GB in size, and we will be unable to extract audio from it. Try using a compressed or
					reduced resolution version of the video that is under 5GB.
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button name="File too large close" onClick={onClose} color="primary">
					Got it.
				</Button>
			</DialogActions>
		</Dialog>
	)
}
