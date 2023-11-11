import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {saveAs} from 'file-saver'
import {IconButton, Menu, MenuItem, Tooltip} from '@material-ui/core'
import MoreIcon from '@material-ui/icons/MoreVert'
import {makeStyles} from '@material-ui/styles'
import {BatchJobActionMenu_batchJobFragment} from './BatchJobHistoryTable.graphql'
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

	const handleDownload = async (downloadPath) => {
		setOptionsMenuAnchorEl(null)

		const {cognitoUserPool} = await import('../cognito')
		const cognitoUser = cognitoUserPool.getCurrentUser()

		cognitoUser.getSession((err, session) => {
			if (err) {
				return console.error(err)
			}
			const token = session.getIdToken().getJwtToken()
			const url = new URL(downloadPath, ApiURL)
			saveAs(`${url.href}?token=${token}`)
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
					aria-label="BatchJob Actions Menu"
					className={classes.menuButton}
					onClick={(e) => setOptionsMenuAnchorEl(e.currentTarget)}>
					<MoreIcon />
				</IconButton>
			</Tooltip>
			<Menu anchorEl={optionsMenuAnchorEl} open={!!optionsMenuAnchorEl} onClose={onCloseOptionsMenu}>
				{batchJob.startedAt ? (
					<MenuItem component={Link} to={`/batches/${batchJob.id}/status`}>
						Check Status
					</MenuItem>
				) : (
					<MenuItem component={Link} to={`/batches/${batchJob.id}/edit`}>
						Edit batch
					</MenuItem>
				)}
				<MenuItem disabled={!batchJob.downloadAvailable} onClick={() => handleDownload(batchJob.downloadLink)}>
					Download Captions
				</MenuItem>
			</Menu>
		</React.Fragment>
	)
}
