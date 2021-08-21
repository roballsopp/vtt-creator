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
		window.gtag('event', 'translate menu item', {
			event_category: 'button_click',
		})
		onOpening()
		handleTranslationDialogOpen(e)
	}

	const tooltipText = getTooltipText(loading, cues)

	if (tooltipText) {
		return (
			<Tooltip title={tooltipText} placement="left" PopperProps={{anchorEl: buttonEl}}>
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

function getTooltipText(loading, cues) {
	if (loading) return 'Please wait...'
	if (!cues.length) return 'Add some captions below, then you can translate them.'
	const charCount = cues.reduce((cnt, c) => cnt + c.text.length, 0)
	if (!charCount) return 'Add some text to your captions to translate.'
}
