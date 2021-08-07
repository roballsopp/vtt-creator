import * as React from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import TranslateIcon from '@material-ui/icons/Translate'
import {useTranslate} from './translation-context'
import {useCues} from '../../common'

TranslateMenuItem.propTypes = {
	onOpening: PropTypes.func.isRequired,
	classes: PropTypes.shape({
		menuIcon: PropTypes.string,
	}).isRequired,
}

export default function TranslateMenuItem({onOpening, classes}) {
	const {handleTranslationDialogOpen, loading} = useTranslate()
	const {cues} = useCues()
	const [buttonEl, setButtonEl] = React.useState()

	const handleClick = e => {
		onOpening()
		handleTranslationDialogOpen(e)
	}

	if (loading) {
		return (
			<Tooltip title="Please wait..." placement="right" PopperProps={{anchorEl: buttonEl}}>
				<span>
					<MenuItem disabled ref={setButtonEl}>
						<TranslateIcon className={classes.menuIcon} />
						Translate Captions...
					</MenuItem>
				</span>
			</Tooltip>
		)
	}

	if (!cues.length) {
		return (
			<Tooltip
				title="Add some captions below, then you can translate them."
				placement="right"
				PopperProps={{anchorEl: buttonEl}}>
				<span>
					<MenuItem disabled ref={setButtonEl}>
						<TranslateIcon className={classes.menuIcon} />
						Translate Captions...
					</MenuItem>
				</span>
			</Tooltip>
		)
	}

	return (
		<MenuItem onClick={handleClick}>
			<TranslateIcon className={classes.menuIcon} />
			Translate Captions...
		</MenuItem>
	)
}
