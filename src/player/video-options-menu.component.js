import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import MoreIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import {useOverlay} from '../common/video'
import SelectVideoButton from '../common/SelectVideoButton'

export default function VideoOptionsMenu() {
	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null)
	const {onShowOverlay, onStartOverlayTimeout} = useOverlay()

	const onOpenOptionsMenu = e => {
		setOptionsMenuAnchorEl(e.currentTarget)
		onShowOverlay()
	}

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null)
		onStartOverlayTimeout()
	}

	return (
		<React.Fragment>
			<Tooltip title="Video Options">
				<IconButton color="inherit" aria-label="Video Options" onClick={onOpenOptionsMenu}>
					<MoreIcon />
				</IconButton>
			</Tooltip>
			<Menu anchorEl={optionsMenuAnchorEl} open={!!optionsMenuAnchorEl} onClose={onCloseOptionsMenu}>
				<SelectVideoButton element={<MenuItem>Select New Video File...</MenuItem>} onSelected={onCloseOptionsMenu} />
			</Menu>
		</React.Fragment>
	)
}
