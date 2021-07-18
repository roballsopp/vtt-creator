import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Link from '@material-ui/core/Link'
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

NotSupportedDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
}

export default function NotSupportedDialog({open, onClose}) {
	return (
		<Dialog maxWidth="sm" fullWidth open={open} onClose={onClose} aria-labelledby="extraction-not-supported-title">
			<Title id="extraction-not-supported-title" disableTypography>
				<Typography variant="h6">Your browser doesn&apos;t support caption extraction</Typography>
				<IconButton aria-label="Close" edge="end" onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Typography>
					It looks like you are using an older browser that doesn&apos;t support some key features needed to extract
					captions from your video. Try loading this app in the latest version of{' '}
					<Link href="https://www.google.com/chrome/">Chrome</Link>,{' '}
					<Link href="https://www.mozilla.org/en-US/firefox/new/">Firefox</Link>, or{' '}
					<Link href="https://www.microsoft.com/en-us/windows/microsoft-edge">Edge</Link>.
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button name="Cue Extract Cancel" onClick={onClose} color="primary">
					Got it.
				</Button>
			</DialogActions>
		</Dialog>
	)
}
