import * as React from 'react'
import PropTypes from 'prop-types'
import {useHistory} from 'react-router-dom'
import download from 'downloadjs'
import {IconButton, Menu, MenuItem, Tooltip} from '@material-ui/core'
import MoreIcon from '@material-ui/icons/MoreVert'
import {makeStyles} from '@material-ui/styles'
import {BatchJobActionMenu_batchJobFragment} from './BatchJobHistoryTable.graphql'
import {cognitoUserPool} from '../cognito'
import {ApiURL} from '../config'

const useStyles = makeStyles({
	menuButton: {
		margin: -12,
	},
})

BatchJobActionMenu.fragments = {
	batchJob: BatchJobActionMenu_batchJobFragment,
}

BatchJobActionMenu.propTypes = {
	batchJob: PropTypes.shape({
		id: PropTypes.string.isRequired,
		downloadAvailable: PropTypes.bool.isRequired,
		downloadLink: PropTypes.string,
		createdAt: PropTypes.string.isRequired,
		startedAt: PropTypes.string,
	}).isRequired,
}

export default function BatchJobActionMenu({batchJob}) {
	const classes = useStyles()
	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null)

	const history = useHistory()

	const handleDownload = downloadPath => {
		setOptionsMenuAnchorEl(null)

		const cognitoUser = cognitoUserPool.getCurrentUser()

		cognitoUser.getSession((err, session) => {
			if (err) {
				return console.error(err)
			}
			const token = session.getIdToken().getJwtToken()
			const url = new URL(downloadPath, ApiURL)
			download(`${url.href}?token=${token}`)
		})
	}

	const handleGoToCart = () => {
		history.push(`/batches/${batchJob.id}/edit`)
	}

	const handleGoToStatus = () => {
		history.push(`/batches/${batchJob.id}/status`)
	}

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null)
	}

	return (
		<React.Fragment>
			<Tooltip title="Click for menu">
				<IconButton
					color="inherit"
					aria-label="BatchJob Actions Menu"
					className={classes.menuButton}
					onClick={e => setOptionsMenuAnchorEl(e.currentTarget)}>
					<MoreIcon />
				</IconButton>
			</Tooltip>
			<Menu anchorEl={optionsMenuAnchorEl} open={!!optionsMenuAnchorEl} onClose={onCloseOptionsMenu}>
				{batchJob.startedAt ? (
					<MenuItem onClick={handleGoToStatus}>Check Status</MenuItem>
				) : (
					<MenuItem onClick={handleGoToCart}>Edit batch</MenuItem>
				)}
				<MenuItem disabled={!batchJob.downloadAvailable} onClick={() => handleDownload(batchJob.downloadLink)}>
					Download cues
				</MenuItem>
			</Menu>
		</React.Fragment>
	)
}
