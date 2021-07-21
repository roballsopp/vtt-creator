import * as React from 'react'
import PropTypes from 'prop-types'
import download from 'downloadjs'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreIcon from '@material-ui/icons/MoreVert'
import Tooltip from '@material-ui/core/Tooltip'
import {makeStyles} from '@material-ui/styles'
import {JobActionMenu_jobFragment} from './JobHistoryTable.graphql'
import {cognitoUserPool} from '../cognito'
import {ApiURL} from '../config'

const useStyles = makeStyles({
	menuButton: {
		margin: -12,
	},
})

JobActionMenu.fragments = {
	job: JobActionMenu_jobFragment,
}

JobActionMenu.propTypes = {
	job: PropTypes.shape({
		id: PropTypes.string.isRequired,
		downloadAvailable: PropTypes.bool.isRequired,
		transcriptDownloadLinkRaw: PropTypes.string,
		transcriptDownloadLinkVTT: PropTypes.string,
		createdAt: PropTypes.string.isRequired,
	}).isRequired,
}

export default function JobActionMenu({job}) {
	const classes = useStyles()
	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null)

	const handleDownloadTranscript = (downloadPath, fileName) => {
		setOptionsMenuAnchorEl(null)

		const cognitoUser = cognitoUserPool.getCurrentUser()

		cognitoUser.getSession((err, session) => {
			if (err) {
				return console.error(err)
			}
			const token = session.getIdToken().getJwtToken()
			const url = new URL(downloadPath, ApiURL)
			download(`${url.href}?token=${token}`, fileName)
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
					aria-label="Job Actions Menu"
					className={classes.menuButton}
					onClick={e => setOptionsMenuAnchorEl(e.currentTarget)}>
					<MoreIcon />
				</IconButton>
			</Tooltip>
			<Menu anchorEl={optionsMenuAnchorEl} open={!!optionsMenuAnchorEl} onClose={onCloseOptionsMenu}>
				<MenuItem
					disabled={!job.downloadAvailable}
					onClick={() => handleDownloadTranscript(job.transcriptDownloadLinkRaw, `${job.id}.json`)}>
					Download raw transcript
				</MenuItem>
				<MenuItem
					disabled={!job.downloadAvailable}
					onClick={() => handleDownloadTranscript(job.transcriptDownloadLinkVTT, `${job.id}.vtt`)}>
					Download transcript as VTT file
				</MenuItem>
			</Menu>
		</React.Fragment>
	)
}
