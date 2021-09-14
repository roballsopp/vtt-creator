import * as React from 'react'
import PropTypes from 'prop-types'
import download from 'downloadjs'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreIcon from '@material-ui/icons/MoreVert'
import Tooltip from '@material-ui/core/Tooltip'
import {makeStyles} from '@material-ui/styles'
import {TranslationActionMenu_translationFragment} from './TranslationHistoryTable.graphql'
import {ApiURL} from '../config'
import {handleError} from '../services/error-handler.service'

const useStyles = makeStyles({
	menuButton: {
		margin: -12,
	},
})

TranslationActionMenu.fragments = {
	translation: TranslationActionMenu_translationFragment,
}

TranslationActionMenu.propTypes = {
	translation: PropTypes.shape({
		id: PropTypes.string.isRequired,
		downloadAvailable: PropTypes.bool.isRequired,
		translationDownloadLinkRaw: PropTypes.string,
		translationDownloadLinkVTT: PropTypes.string,
		translationDownloadLinkSRT: PropTypes.string,
		createdAt: PropTypes.string.isRequired,
	}).isRequired,
}

export default function TranslationActionMenu({translation}) {
	const classes = useStyles()
	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null)

	const handleDownloadTranscript = async downloadPath => {
		setOptionsMenuAnchorEl(null)

		const {cognitoUserPool} = await import('../cognito')
		const cognitoUser = cognitoUserPool.getCurrentUser()

		cognitoUser.getSession((err, session) => {
			if (err) {
				return handleError(err)
			}
			const token = session.getIdToken().getJwtToken()
			const url = new URL(downloadPath, ApiURL)
			download(`${url.href}?token=${token}`)
		})
	}

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null)
	}

	return (
		<React.Fragment>
			<Tooltip title="Click for menu">
				<IconButton
					color="inherit"
					aria-label="Translation Actions Menu"
					className={classes.menuButton}
					onClick={e => setOptionsMenuAnchorEl(e.currentTarget)}>
					<MoreIcon />
				</IconButton>
			</Tooltip>
			<Menu anchorEl={optionsMenuAnchorEl} open={!!optionsMenuAnchorEl} onClose={onCloseOptionsMenu}>
				<MenuItem
					disabled={!translation.downloadAvailable}
					onClick={() => handleDownloadTranscript(translation.translationDownloadLinkRaw)}>
					Download raw translation
				</MenuItem>
				<MenuItem
					disabled={!translation.downloadAvailable}
					onClick={() => handleDownloadTranscript(translation.translationDownloadLinkVTT)}>
					Download translation as VTT file
				</MenuItem>
				<MenuItem
					disabled={!translation.downloadAvailable}
					onClick={() => handleDownloadTranscript(translation.translationDownloadLinkSRT)}>
					Download translation as SRT file
				</MenuItem>
			</Menu>
		</React.Fragment>
	)
}
